import {expect} from 'chai';
import sinon from 'sinon';
import {SessionType} from '../../../shared/session/sessionType';
import JassAppConstants from '../../../client/js/jassAppConstants';

import * as GameSetupDispatchFunctions from '../../../client/js/gameSetup/gameSetupDispatchFunctions';

describe('GameSetupDispatchFunctions', () => {

    let gameSetupDispatchFunctions,
        dispatchSpy;

    beforeEach(() => {
        dispatchSpy = sinon.spy();
        gameSetupDispatchFunctions = GameSetupDispatchFunctions.create(dispatchSpy);
    });

    describe('createNewSession', () => {
        it('should dispatch create session message when sessiontype TOURNAMENT', () => {
            const sessionType = SessionType.TOURNAMENT,
                sessionName = 'sessionName',
                asSpectator = true;


            gameSetupDispatchFunctions.createNewSession(sessionType, sessionName, asSpectator);

            sinon.assert.calledWith(dispatchSpy, {
                type: JassAppConstants.CREATE_NEW_SESSION,
                data: {
                    sessionName,
                    sessionType,
                    asSpectator
                }
            });
        });

        it('should dispatch prepared join session message when sessiontype SINGLE_GAME', () => {
            const sessionType = SessionType.SINGLE_GAME,
                sessionName = 'sessionName',
                asSpectator = true,
                chosenTeamIndex = 1;


            gameSetupDispatchFunctions.createNewSession(sessionType, sessionName, asSpectator);

            sinon.assert.calledWith(dispatchSpy, {
                type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
                data: {
                    sessionName,
                    joinSession: sinon.match((joinSessionFunction) => {
                        joinSessionFunction(chosenTeamIndex);
                        sinon.assert.calledWith(dispatchSpy, {
                            type: JassAppConstants.CREATE_NEW_SESSION,
                            data: {
                                sessionType,
                                sessionName,
                                asSpectator,
                                chosenTeamIndex
                            }
                        });
                        return true;
                    })
                }
            });
        });
    });

    describe('autojoinSession', () => {
        it('should dispatch create session message when sessiontype TOURNAMENT', () => {
            gameSetupDispatchFunctions.autojoinSession();

            sinon.assert.calledWith(dispatchSpy, {
                type: JassAppConstants.AUTOJOIN_SESSION
            });
        });
    });

    describe('joinExistingSession', () => {
        it('should dispatch prepared join session message', () => {
            const sessionName = 'sessionName',
                chosenTeamIndex = 2;

            gameSetupDispatchFunctions.joinExistingSession(sessionName);

            sinon.assert.calledWith(dispatchSpy, {
                type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
                data: {
                    sessionName,
                    joinSession: sinon.match((joinSessionFunction) => {
                        joinSessionFunction(chosenTeamIndex);
                        sinon.assert.calledWith(dispatchSpy, {
                            type: JassAppConstants.CHOOSE_EXISTING_SESSION,
                            data: {
                                sessionName,
                                chosenTeamIndex
                            }
                        });
                        return true;
                    })
                }
            });
        });
    });

    describe('joinExistingSessionSpectator', () => {
        it('should dispatch', () => {
            const sessionName = 'sessionName';

            gameSetupDispatchFunctions.joinExistingSessionSpectator(sessionName);

            sinon.assert.calledWith(dispatchSpy, {
                type: JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR,
                data: sessionName
            })
        });
    });
});