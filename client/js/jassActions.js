'use strict';

let JassAppConstants = require('./jassAppConstants'),
    JassAppDispatcher = require('./jassAppDispatcher');

module.exports = {
    requestPlayerName: () => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.REQUEST_PLAYER_NAME
        });
    },

    choosePlayerName: (playerName) => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.CHOOSE_PLAYER_NAME,
            data: playerName
        });
    },

    requestSessionChoice: (availableSessions) => {
        JassAppDispatcher.handleServerAction({
            actionType:JassAppConstants.REQUEST_SESSION_CHOICE,
            data: availableSessions
        });
    }
};