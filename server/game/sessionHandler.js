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
        return createSession(sessions, {
            sessionName: UUID.v4()
        });
    }

    return filteredSessions[0];
}

function createSession(sessions, sessionChoiceResponse) {
    let session = JassSession.create(sessionChoiceResponse.sessionName);
    sessions.push(session);
    return session;
}

function findSession(sessions, sessionChoiceResponse) {
    let filteredSessions = sessions.filter((session) => {
        return !session.isComplete() && session.name === sessionChoiceResponse.sessionName;
    });

    if (filteredSessions.length === 0) {
        return createSession(sessions, sessionChoiceResponse);
    }

    return filteredSessions[0];
}

function createOrJoinSession(sessions, sessionChoiceResponse) {
    switch (sessionChoiceResponse.sessionChoice) {
        case SessionChoice.CREATE_NEW:
            return createSession(sessions, sessionChoiceResponse);
        case SessionChoice.SPECTATOR:
        case SessionChoice.JOIN_EXISTING:
            return findSession(sessions, sessionChoiceResponse);
        default:
            return findOrCreateSessionWithSpace(sessions);
    }
}

function removeSession(sessions, session) {
    let index = sessions.indexOf(session);
    sessions.splice(index, 1);
}

function keepSessionAlive(webSocket, intervall) {
    if (webSocket.readyState === 1) {
        webSocket.ping();
        setTimeout(keepSessionAlive.bind(null, webSocket, intervall), intervall);
    }
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
        keepSessionAlive(ws, 30000);

        return clientApi.requestPlayerName(ws).then((playerName) => {
            return clientApi.requestSessionChoice(ws, this.getAvailableSessionNames()).then((sessionChoiceResponse) => {
                let session = createOrJoinSession(this.sessions, sessionChoiceResponse);

                if (sessionChoiceResponse.sessionChoice === SessionChoice.SPECTATOR) {
                    session.addSpectator(ws);
                } else {
                    session.addPlayer(ws, playerName).catch(() => {
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
                }
            });
        });
    },

    resetInstance: function resetInstance() {
        this.sessions = [];
    }

};

module.exports = SessionHandler;



