'use strict';

import {EventEmitter} from 'events';
import JassAppDispatcher from '../jassAppDispatcher';
import JassAppConstants from '../jassAppConstants';

export const GameSetupState = {
    CONNECTING: 'CONNECTING',
    SET_PLAYER_NAME: 'SET_PLAYER_NAME',
    CHOOSE_SESSION: 'CHOOSE_SESSION',
    CHOOSE_TEAM: 'CHOOSE_TEAM',
    WAIT_FOR_PLAYERS: 'WAIT_FOR_PLAYERS',
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
        case JassAppConstants.CHOOSE_SESSION_PARTIAL:
            GameSetupStore.state.status = GameSetupState.CHOOSE_TEAM;
            GameSetupStore.state.chosenSession = action.data;
            GameSetupStore.emitChange();
            break;
        case JassAppConstants.CREATE_NEW_SESSION:
            GameSetupStore.state.status = GameSetupState.WAIT_FOR_PLAYERS;
            GameSetupStore.state.chosenSession = action.data;
            GameSetupStore.emitChange();
            break;
        case JassAppConstants.CHOOSE_EXISTING_SESSION:
            GameSetupStore.state.status = GameSetupState.WAIT_FOR_PLAYERS;
            GameSetupStore.state.chosenSession = action.data;
            GameSetupStore.emitChange();
            break;
        case JassAppConstants.SESSION_JOINED:
            if (GameSetupStore.state.status !== GameSetupState.FINISHED) {
                if (action.data.playersInSession.length === 4) {
                    GameSetupStore.state.status = GameSetupState.FINISHED;
                } else {
                    GameSetupStore.state.status = GameSetupState.WAIT_FOR_PLAYERS;
                }
                GameSetupStore.emitChange();
            }
            break;
        case JassAppConstants.BROADCAST_TOURNAMENT_RANKING_TABLE:
        case JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR:
        case JassAppConstants.AUTOJOIN_SESSION:
            GameSetupStore.state.status = GameSetupState.FINISHED;
            GameSetupStore.emitChange();
            break;
    }
});

export default GameSetupStore;