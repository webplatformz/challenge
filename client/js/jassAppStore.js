'use strict';

import {EventEmitter} from 'events';
import JassAppDispatcher from './jassAppDispatcher.js';
import JassAppConstants from './jassAppConstants.js';
import {SessionType} from '../../shared/session/sessionType.js';

let JassAppStore = Object.create(EventEmitter.prototype);

JassAppStore.state = {
    error: undefined,
    sessionType: undefined,
    tournamentStarted: false
};

JassAppStore.emitChange = function() {
    this.emit('change');
};

JassAppStore.addChangeListener = function(callback) {
    this.on('change', callback);
};

JassAppStore.removeChangeListener = function(callback) {
    this.removeListener('change', callback);
};

JassAppDispatcher.register(function (payload){
    let action = payload.action;

    switch(action.actionType) {
        case JassAppConstants.ERROR:
            JassAppStore.state.error = action.data;
            JassAppStore.emitChange();
            break;
        case JassAppConstants.SESSION_JOINED:
            JassAppStore.state.sessionType = SessionType.SINGLE_GAME;
            JassAppStore.emitChange();
            break;
        case JassAppConstants.BROADCAST_TOURNAMENT_RANKING_TABLE:
            JassAppStore.state.sessionType = SessionType.TOURNAMENT;
            JassAppStore.state.rankingTable = action.data;
            JassAppStore.emitChange();
            break;
        case JassAppConstants.BROADCAST_TOURNAMENT_STARTED:
            JassAppStore.state.tournamentStarted = true;
            JassAppStore.emitChange();
            break;
        case JassAppConstants.SEND_REGISTRY_BOTS:
            JassAppStore.state.registryBots = action.data;
            JassAppStore.emitChange();
            break;
    }
});

export default JassAppStore;
