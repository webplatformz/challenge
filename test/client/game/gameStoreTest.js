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
        expect(state.playerSeating).to.eql(['bottom', 'right', 'top', 'left']);
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
        expect(GameStore.state.playerSeating).to.eql(['left', 'bottom', 'right', 'top']);

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
        expect(GameStore.state.playerSeating).to.eql(['left', 'bottom', 'right', 'top']);
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

    it('should calculate team points and set Player to start next turn', () => {
        let dummyPayload = {
            action: {
                actionType: JassAppConstants.BROADCAST_STICH,
                data: {
                    "name" : "Player 1",
                    "id" : 1,
                    "playedCards" : [],
                    "teams" : [
                        {
                            "name" : "Team 2",
                            "points" : 157,
                            "currentRoundPoints" : 0
                        },
                        {
                            "name" : "Team 1",
                            "points" : 0,
                            "currentRoundPoints" : 42
                        }
                    ]
                }
            }
        };
        GameStore.state.players = [
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
            },
            {
                name: 'Player 3',
                id: 3
            }
        ];
        GameStore.state.teams = [
            {
                name: 'Team 1'
            },
            {
                name: 'Team 2'
            }
        ];

        GameStore.handleAction(dummyPayload);

        expect(GameStore.state.status).to.equal(GameStore.GameState.STICH);
        expect(GameStore.state.teams[0].points).to.equal(dummyPayload.action.data.teams[1].points);
        expect(GameStore.state.teams[0].currentRoundPoints).to.equal(dummyPayload.action.data.teams[1].currentRoundPoints);
        expect(GameStore.state.teams[1].points).to.equal(dummyPayload.action.data.teams[0].points);
        expect(GameStore.state.teams[1].currentRoundPoints).to.equal(dummyPayload.action.data.teams[0].currentRoundPoints);

        let dummyPayload2 = {
            action: {
                actionType: JassAppConstants.PLAYED_CARDS
            }
        };

        GameStore.handleAction(dummyPayload2);

        expect(GameStore.state.startingPlayerIndex).to.equal(1);
    });

});