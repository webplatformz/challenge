'use strict';

let clientApi = require('../communication/clientApi').create();
let JassSession = require('./session');
let SessionChoice = require('../../shared/game/sessionChoice');
let UUID = require('uuid');

let sessions = [];

function findOrCreateSessionWithSpace() {
    let filteredSessions = sessions.filter((element) => {
        return !element.isComplete();
    });

    if (filteredSessions.length === 0) {
        return createSession(UUID.v4());
    }

    return filteredSessions[0];
}

function createSession(sessionName) {
    let session = JassSession.create(sessionName);
    sessions.push(session);
    return session;
}

function findSession(sessionName) {
    let filteredSessions = sessions.filter((element) => {
        return element.name === sessionName;
    });

    if (filteredSessions.length === 0) {
        return createSession(sessionName);
    }

    return filteredSessions[0];
}

function createOrJoinSession(sessionChoiceResponse) {
    switch (sessionChoiceResponse.sessionChoice) {
        case SessionChoice.CREATE_NEW:
            return createSession(sessionChoiceResponse.sessionName);
        case SessionChoice.JOIN_EXISTING:
            return findSession(sessionChoiceResponse.sessionName);
        default:
            return findOrCreateSessionWithSpace();
    }
}

function getAvailableSessionNames() {
    return sessions.filter((session) => {
        return !session.isComplete();
    }).map((session) => {
        return session.name;
    });
}

let SessionHandler = {

    handleClientConnection : function handleClientConnection(ws) {
        return clientApi.requestPlayerName(ws).then((playerName) => {
            return clientApi.requestSessionChoice(ws, getAvailableSessionNames()).then((sessionChoiceResponse) => {
                let session = createOrJoinSession(sessionChoiceResponse);

                session.addPlayer(ws, playerName);

                if (session.isComplete()) {
                    session.start().then((team) => {
                        console.log("Team " + team.name + " won ");
                    });
                }
            });
        });
    },

    resetInstance : function resetInstance() {
        sessions = [];
    }

};

module.exports = SessionHandler;



