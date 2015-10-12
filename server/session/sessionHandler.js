'use strict';

import ClientApi from '../communication/clientApi.js';
import SessionFactory from './sessionFactory.js';
import SessionChoice from '../../shared/session/sessionChoice.js';
import SessionType from '../../shared/session/sessionType.js';
import UUID from 'uuid';
import CloseEventCode from '../communication/closeEventCode.js';

let clientApi = ClientApi.create();

function findOrCreateSessionWithSpace(sessions, sessionChoiceResponse) {
    let filteredSessions = sessions.filter((element) => {
        return !element.isComplete();
    });

    if (filteredSessions.length === 0) {
        return createSession(sessions, {
            sessionName: sessionChoiceResponse.sessionName || UUID.v4(),
            sessionType: sessionChoiceResponse.sessionType || SessionType.SINGLE_GAME
        });
    }

    return filteredSessions[0];
}

function createSession(sessions, sessionChoiceResponse) {
    let session = SessionFactory.create(sessionChoiceResponse.sessionName, sessionChoiceResponse.sessionType);
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
            return findOrCreateSessionWithSpace(sessions, sessionChoiceResponse);
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

                if (sessionChoiceResponse.sessionChoice === SessionChoice.SPECTATOR || sessionChoiceResponse.asSpectator) {
                    session.addSpectator(ws);
                } else {
                    session.addPlayer(ws, playerName);

                    if (session.isComplete()) {
                        this.startSession(session);
                    }
                }
            });
        });
    },

    startSession: function startSession(session) {
        session.start().then(
            this.finishSession.bind(this, session, CloseEventCode.NORMAL),
            this.finishSession.bind(this, session, CloseEventCode.ABNORMAL));
    },

    finishSession: function finishSession(session, code) {
        session.close(code, 'Game Finished');
        removeSession(this.sessions, session);
    },

    resetInstance: function resetInstance() {
        this.sessions = [];
    }

};

export default SessionHandler;



