import {SessionType} from '../../../shared/session/sessionType';
import JassAppConstants from '../jassAppConstants';

export default (state = {}, action) => {
    switch (action.type) {
        case JassAppConstants.ERROR:
            return Object.assign({}, state, {error: action.data});
        case JassAppConstants.SESSION_JOINED:
            return Object.assign({}, state, {sessionType: SessionType.SINGLE_GAME});
        case JassAppConstants.BROADCAST_TOURNAMENT_RANKING_TABLE:
            return Object.assign({}, state, {sessionType: SessionType.TOURNAMENT});
        default:
            return state;
    }
}
