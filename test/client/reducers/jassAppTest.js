import {expect} from 'chai';
import jassAppReducer from '../../../client/js/reducers/jassApp';
import JassAppConstants from '../../../client/js/jassAppConstants';
import {SessionType} from '../../../shared/session/sessionType';

describe('JassApp Reducer', () => {
    it('should reduce to default state', () => {
        expect(jassAppReducer(undefined, {})).to.eql({});
    });

    it('should update error message', () => {
        const action = {
            type: JassAppConstants.ERROR,
            data: 'errorMessage'
        };
        const state = {
            sessionType: 'sessionType'
        };

        const actual = jassAppReducer(state, action);

        expect(actual.error).to.equal(action.data);
        expect(actual.sessionType).to.equal(state.sessionType);
    });

    it('should set sessionType when single game', () => {
        const action = {
            type: JassAppConstants.SESSION_JOINED
        };

        const actual = jassAppReducer(undefined, action);

        expect(actual.sessionType).to.equal(SessionType.SINGLE_GAME);
    });

    it('should set sessionType when tournament', () => {
        const action = {
            type: JassAppConstants.BROADCAST_TOURNAMENT_RANKING_TABLE
        };

        const actual = jassAppReducer(undefined, action);

        expect(actual.sessionType).to.equal(SessionType.TOURNAMENT);
    });
});