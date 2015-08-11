'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import GameStore from '../../../client/js/game/gameStore';
import JassAppConstants from '../../../client/js/jassAppConstants';
import JassAppDispatcher from '../../../client/js/jassAppDispatcher';
import {CardColor} from '../../../shared/deck/card';

describe('GameStore', () => {

    let setTimeoutStub,
        initialGameState;

    beforeEach(() => {
        setTimeoutStub = sinon.stub(window, 'setTimeout');
        initialGameState = GameStore.state;
    });

    afterEach(() => {
        window.setTimeout.restore();
        GameStore.state = initialGameState;
    });

    it('should have initial state', () => {
        let state = GameStore.state;

        expect(state.playerType).to.equal(GameStore.PlayerType.PLAYER);
        expect(state.cardType).to.equal(GameStore.CardType.FRENCH);
        expect(state.players).to.eql([]);
        expect(state.teams).to.eql([]);
        expect(state.playerSeating).to.eql(['bottom', 'left', 'top', 'right']);
        expect(state.tableCards).to.eql([]);
        expect(state.playerCards).to.eql([]);
        expect(state.startingPlayerIndex).to.equal(0);
        expect(state.status).to.equal(GameStore.GameState.WAITING);
    });

    it('should start spectator rendering when session joined as a spectator', () => {
        let dummyPayload = {
            action: {
                actionType: JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR
            }
        };
        GameStore.state.playerType = GameStore.PlayerType.SPECTATOR;

        GameStore.handleAction(dummyPayload);

        expect(setTimeoutStub.withArgs(sinon.match.func, 500).calledOnce).to.equal(true);
    });

    it('should intialize and add more player with each SESSION_JOINED', () => {
        let dummyPayload = {
            action: {
                actionType: JassAppConstants.SESSION_JOINED,
                data: {
                    player: {
                        name: 'Player 1',
                        id: 1
                    },
                    playersInSession: [
                        {
                            name: 'Player 0',
                            id: 0
                        },
                        {
                            name: 'Player 1',
                            id: 1
                        }
                    ]
                }
            }
        };

        GameStore.handleAction(dummyPayload);

        expect(GameStore.state.players).to.eql(dummyPayload.action.data.playersInSession);
        expect(GameStore.state.playerSeating).to.eql(['right', 'bottom', 'left', 'top']);

        let dummyPayload2 = {
            action: {
                actionType: JassAppConstants.SESSION_JOINED,
                data: {
                    player: {
                        name: 'Player 2',
                        id: 2
                    },
                    playersInSession: [
                        {
                            name: 'Player 0',
                            id: 0
                        },
                        {
                            name: 'Player 1',
                            id: 1
                        },
                        {
                            name: 'Player 2',
                            id: 2
                        }
                    ]
                }
            }
        };

        GameStore.handleAction(dummyPayload2);

        expect(GameStore.state.players).to.eql(dummyPayload2.action.data.playersInSession);
        expect(GameStore.state.playerSeating).to.eql(['right', 'bottom', 'left', 'top']);
    });

    it('should filter cards on chooseCard', () => {
        let dummyPayload = {
            action: {
                actionType: JassAppConstants.CHOOSE_CARD,
                data: {
                    color: CardColor.HEARTS,
                    number: 9
                }
            }
        };
        GameStore.state.playerCards = [
            {
                color: CardColor.DIAMONDS,
                number: 6
            },
            {
                color: CardColor.HEARTS,
                number: 9
            },
            {
                color: CardColor.HEARTS,
                number: 14
            }
        ];

        GameStore.handleAction(dummyPayload);

        expect(GameStore.state.playerCards).to.eql([
            {
                color: CardColor.DIAMONDS,
                number: 6
            },
            {
                color: CardColor.HEARTS,
                number: 14
            }
        ]);
    });

});