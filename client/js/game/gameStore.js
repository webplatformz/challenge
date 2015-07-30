'use strict';

let EventEmitter = require('events').EventEmitter,
    JassAppDispatcher = require('../jassAppDispatcher'),
    JassAppConstants = require('../jassAppConstants');

let GameState = {
    WAITING: 'WAITING'
};

let GameStore = Object.create(EventEmitter.prototype);

GameStore.GameState = GameState;

GameStore.state = {
    players: [],
    status: GameState.WAITING
};

GameStore.emitChange = function() {
    this.emit('change');
};

GameStore.addChangeListener = function(callback) {
    this.on('change', callback);
};

GameStore.removeChangeListener = function(callback) {
    this.removeListener('change', callback);
};

JassAppDispatcher.register(function (payload){
    let action = payload.action;

    switch(action.actionType) {
        case JassAppConstants.SESSION_JOINED:
            GameStore.state.players.push(action.data);
            GameStore.emitChange();
            break;
    }
});

module.exports = GameStore;