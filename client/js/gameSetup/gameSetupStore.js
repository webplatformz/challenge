'use strict';

import {EventEmitter} from 'events';
import JassAppDispatcher from '../jassAppDispatcher';
import JassAppConstants from '../jassAppConstants';

export const GameSetupState = {
    CONNECTING: 'CONNECTING',
    SET_PLAYER_NAME: 'SET_PLAYER_NAME',
    CHOOSE_SESSION: 'CHOOSE_SESSION',
    FINISHED: 'FINISHED'
};

let GameSetupStore = Object.assign(Object.create(EventEmitter.prototype), {
    GameSetupState,

    state: {
        status: GameSetupState.CONNECTING
    },

    emitChange: function () {
        this.emit('change');
    },

    addChangeListener: function (callback) {
        this.on('change', callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener('change', callback);
    }
});

JassAppDispatcher.register(function (payload) {
    let action = payload.action;

    switch (action.actionType) {
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
        case JassAppConstants.BROADCAST_TOURNAMENT_RANKING_TABLE:
            GameSetupStore.state.status = GameSetupState.FINISHED;
            GameSetupStore.emitChange();
            break;
        case JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR:
            GameSetupStore.state.status = GameSetupState.FINISHED;
            GameSetupStore.emitChange();
            break;
    }
});

export default GameSetupStore;