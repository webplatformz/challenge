'use strict';

let EventEmitter = require('events').EventEmitter,
    JassAppDispatcher = require('../jassAppDispatcher'),
    JassAppConstants = require('../jassAppConstants');

let GameSetupState = {
    CONNECTING: 'CONNECTING',
    SET_PLAYER_NAME: 'SET_PLAYER_NAME',
    CHOOSE_SESSION: 'CHOOSE_SESSION',
    FINISHED: 'FINISHED'
};

let GameSetupStore = Object.create(EventEmitter.prototype);

GameSetupStore.GameSetupState = GameSetupState;

GameSetupStore.state = {
    status:GameSetupState.CONNECTING
};

GameSetupStore.emitChange = function() {
    this.emit('change');
};

GameSetupStore.addChangeListener = function(callback) {
    this.on('change', callback);
};

GameSetupStore.removeChangeListener = function(callback) {
    this.removeListener('change', callback);
};

JassAppDispatcher.register(function (payload){
    let action = payload.action;

    switch(action.actionType) {
        case JassAppConstants.REQUEST_PLAYER_NAME:
            GameSetupStore.state.status = GameSetupState.SET_PLAYER_NAME;
            GameSetupStore.emitChange();
            break;
        case JassAppConstants.REQUEST_SESSION_CHOICE:
            GameSetupStore.state.status = GameSetupState.CHOOSE_SESSION;
            GameSetupStore.state.sessions = action.data;
            GameSetupStore.emitChange();
            break;
        case JassAppConstants.SESSION_JOINED:
            GameSetupStore.state.status = GameSetupState.FINISHED;
            GameSetupStore.emitChange();
            break;
    }
});

module.exports = GameSetupStore;