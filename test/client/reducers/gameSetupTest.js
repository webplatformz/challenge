import {expect} from 'chai';
import {default as gameSetupReducer, GameSetupStep} from '../../../client/js/reducers/gameSetup';
import JassAppConstants from '../../../client/js/jassAppConstants';


describe.only('GameSetup Reducer', () => {
    it('should set step CONNECTING initially', () => {
        expect(gameSetupReducer(undefined, {type: 'type'})).to.eql({step: GameSetupStep.CONNECTING});
    });

    it('should set step SET_PLAYER_NAME when requesting name', () => {
        const action = {
            type: JassAppConstants.REQUEST_PLAYER_NAME
        };

        const actual = gameSetupReducer(undefined, action);

        expect(actual).to.eql({
            step: GameSetupStep.SET_PLAYER_NAME
        });
    });

    it('should set step CHOOSE_SESSION with sessions when requesting session choice', () => {
        const action = {
            type: JassAppConstants.REQUEST_SESSION_CHOICE,
            data: ['someSession']
        };

        const actual = gameSetupReducer(undefined, action);

        expect(actual).to.eql({
            step: GameSetupStep.CHOOSE_SESSION,
            sessions: action.data
        });
    });

    it('should set step CHOOSE_TEAM with session choose finalisation params when session chosen', () => {
        const action = {
            type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
            data: 'chooseSessionPartial'
        };

        const actual = gameSetupReducer(undefined, action);

        expect(actual).to.eql({
            step: GameSetupStep.CHOOSE_TEAM,
            chosenSession: action.data
        });
    });

    it('should set step FINISHED when session joined', () => {
        const action = {
            type: JassAppConstants.SESSION_JOINED
        };

        const actual = gameSetupReducer(undefined, action);

        expect(actual).to.eql({
            step: GameSetupStep.FINISHED
        });
    });

    it('should set step FINISHED when broadcast tournament ranking table', () => {
        const action = {
            type: JassAppConstants.BROADCAST_TOURNAMENT_RANKING_TABLE
        };

        const actual = gameSetupReducer(undefined, action);

        expect(actual).to.eql({
            step: GameSetupStep.FINISHED
        });
    });

    it('should set step FINISHED when session joined as spectator', () => {
        const action = {
            type: JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR
        };

        const actual = gameSetupReducer(undefined, action);

        expect(actual).to.eql({
            step: GameSetupStep.FINISHED
        });
    });
});