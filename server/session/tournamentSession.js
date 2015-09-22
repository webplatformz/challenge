'use strict';

import SessionType from '../../shared/session/sessionType.js';

let TournamentSession = {
    type: SessionType.TOURNAMENT,

    addPlayer: function() {

    },

    addSpectator: function() {

    },

    isComplete: function() {
        return false;
    },

    start: function() {

    }
};

module.exports = {
    create: (sessionName) => {
        let session = Object.create(TournamentSession);
        session.name = sessionName;
        session.players = [];
        session.spectators = [];
        return session;
    }
};