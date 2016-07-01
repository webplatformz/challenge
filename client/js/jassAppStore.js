import { EventEmitter } from 'events';
import JassAppDispatcher from './jassAppDispatcher';
import JassAppConstants from './jassAppConstants';
import { SessionType } from '../../shared/session/sessionType';

const JassAppStore = Object.create(EventEmitter.prototype);

JassAppStore.state = {
    error: undefined,
    sessionType: undefined
};

JassAppStore.emitChange = function () {
    this.emit('change');
};

JassAppStore.addChangeListener = function (callback) {
    this.on('change', callback);
};

JassAppStore.removeChangeListener = function (callback) {
    this.removeListener('change', callback);
};

JassAppDispatcher.register(function (payload) {
    let action = payload.action;

    switch (action.actionType) {
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
        JassAppStore.emitChange();
        break;
    }
});

export default JassAppStore;
