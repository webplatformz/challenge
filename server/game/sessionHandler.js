'use strict';

let clientApi = require('../communication/clientApi').create();
let JassSession = require('./session');
let SessionChoice = require('../../shared/game/sessionChoice');
let UUID = require('uuid');

function findOrCreateSessionWithSpace(sessions) {
    let filteredSessions = sessions.filter((element) => {
        return !element.isComplete();
    });

    if (filteredSessions.length === 0) {
        return createSession(sessions, UUID.v4());
    }

    return filteredSessions[0];
}

function createSession(sessions, sessionName) {
    let session = JassSession.create(sessionName);
    sessions.push(session);
    return session;
}

function findSession(sessions, sessionName) {
    let filteredSessions = sessions.filter((session) => {
        return !session.isComplete() && session.name === sessionName;
    });

    if (filteredSessions.length === 0) {
        return createSession(sessions, sessionName);
    }

    return filteredSessions[0];
}

function createOrJoinSession(sessions, sessionChoiceResponse) {
    switch (sessionChoiceResponse.sessionChoice) {
        case SessionChoice.CREATE_NEW:
            return createSession(sessions, sessionChoiceResponse.sessionName);
        case SessionChoice.JOIN_EXISTING:
            return findSession(sessions, sessionChoiceResponse.sessionName);
        default:
            return findOrCreateSessionWithSpace(sessions);
    }
}

function removeSession(sessions, session) {
    let index = sessions.indexOf(session);
    sessions.splice(index, 1);
}

let SessionHandler = {

    sessions: [],

    getAvailableSessionNames() {
        return this.sessions.filter((session) => {
            return !session.isComplete();
        }).map((session) => {
            return session.name;
        });
    },

    handleClientConnection: function handleClientConnection(ws) {
        return clientApi.requestPlayerName(ws).then((playerName) => {
            return clientApi.requestSessionChoice(ws, this.getAvailableSessionNames()).then((sessionChoiceResponse) => {
                let session = createOrJoinSession(this.sessions, sessionChoiceResponse);

                let player = session.addPlayer(ws, playerName);

                ws.on('close', (code, message) => {
                    session.handlePlayerLeft(player, code, message);
                    removeSession(this.sessions, session);
                });

                if (session.isComplete()) {
                    session.start().then(() => {
                        //TODO let bots restart the session
                        session.close();
                        removeSession(this.sessions, session);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            });
        });
    },

    resetInstance: function resetInstance() {
        this.sessions = [];
    }

};

module.exports = SessionHandler;



