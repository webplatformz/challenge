import {expect} from 'chai';
import sinon from 'sinon';
import {default as GameStore, CardType, PlayerType, GameState} from '../../../client/js/game/gameStore';
import JassAppConstants from '../../../client/js/jassAppConstants';
import {CardColor} from '../../../shared/deck/cardColor';
import * as Card from '../../../shared/deck/card';

describe('GameStore', () => {

    let initialGameState,
        handlePayloadSpy;

    beforeEach(() => {
        initialGameState = GameStore.state;
        handlePayloadSpy = sinon.spy(GameStore, 'handlePayload');
    });

    afterEach(() => {
        GameStore.state = initialGameState;
        GameStore.handlePayload.restore();
    });

    const filterEmptyPlayer = function(gamestoreState) {
        return gamestoreState.players.filter(player => player.name !== 'Waiting for player...');
    };


    it('should have initial state', () => {
        let state = GameStore.state;

        expect(state.playerType).to.equal(PlayerType.PLAYER);
        expect(state.cardType).to.equal(CardType.FRENCH);
        expect(state.players).to.eql([]);
        expect(state.teams).to.eql([]);
        expect(state.playerSeating).to.eql(['bottom', 'right', 'top', 'left']);
        expect(state.tableCards).to.eql([]);
        expect(state.playerCards).to.eql([]);
        expect(state.startingPlayerIndex).to.equal(0);
        expect(state.nextStartingPlayerIndex).to.equal(0);
        expect(state.roundPlayerIndex).to.equal(0);
        expect(state.cyclesMade).to.equal(0);
        expect(state.status).to.equal(GameState.WAITING);
        expect(state.lastStichCards).to.eql([]);
        expect(state.lastStichStartingPlayerIndex).to.be.undefined;
    });

    it('should emit events in the right order with given timeout for spectator', (done) => {
        const gameFinishedBroadcast = {
            action: {
                actionType: JassAppConstants.BROADCAST_GAME_FINISHED
            },
            source: 'SERVER_ACTION'
        };
        const adjustSpectatorSpeed = {
            action: {
                actionType: JassAppConstants.ADJUST_SPECTATOR_SPEED,
                data: 0
            }
        };
        const payload = {
            action: {
                actionType: JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR
            }
        };

        GameStore.handleAction(adjustSpectatorSpeed);
        GameStore.handleAction(payload);
        GameStore.handleAction(gameFinishedBroadcast);

        sinon.assert.calledWith(handlePayloadSpy.secondCall, payload);
        sinon.assert.calledTwice(handlePayloadSpy);

        setTimeout(function () {
            sinon.assert.calledThrice(handlePayloadSpy);
            sinon.assert.calledWith(handlePayloadSpy.secondCall, payload);
            sinon.assert.calledWith(handlePayloadSpy.thirdCall, gameFinishedBroadcast);
            done();
        }, 0);

    });

    it('should intialize and add more player with each SESSION_JOINED', () => {
        let dummyPayload = {
            action: {
                actionType: JassAppConstants.SESSION_JOINED,
                data: {
                    player: {
                        name: 'Player 1',
                        seatId: 1,
                        id: 'A1'
                    },
                    playersInSession: [
                        {
                            name: 'Player 0',
                            id: 'A0',
                            seatId: 0
                        },
                        {
                            name: 'Player 1',
                            id: 'A1',
                            seatId: 1
                        }
                    ]
                }
            }
        };

        GameStore.handleAction(dummyPayload);

        expect(filterEmptyPlayer(GameStore.state)).to.eql(dummyPayload.action.data.playersInSession);
        expect(GameStore.state.playerSeating).to.eql(['left', 'bottom', 'right', 'top']);

        let dummyPayload2 = {
            action: {
                actionType: JassAppConstants.SESSION_JOINED,
                data: {
                    player: {
                        name: 'Player 2',
                        id: '2',
                        seatId: 2
                    },
                    playersInSession: [
                        {
                            name: 'Player 0',
                            id: '0',
                            seatId: 0
                        },
                        {
                            name: 'Player 1',
                            id: '1',
                            seatId: 1
                        },
                        {
                            name: 'Player 2',
                            id: '2',
                            seatId: 2
                        }
                    ]
                }
            }
        };

        GameStore.handleAction(dummyPayload2);

        expect(filterEmptyPlayer(GameStore.state)).to.eql(dummyPayload2.action.data.playersInSession);
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
            Card.create(6, CardColor.DIAMONDS),
            Card.create(9, CardColor.HEARTS),
            Card.create(14, CardColor.HEARTS)
        ];

        GameStore.handleAction(dummyPayload);

        expect(GameStore.state.playerCards).to.eql([
            Card.create(6, CardColor.DIAMONDS),
            Card.create(14, CardColor.HEARTS)
        ]);
    });

    it('should set game state to PLAYED_CARD on chooseCard', () => {
        let dummyPayload = {
            action: {
                actionType: JassAppConstants.CHOOSE_CARD,
                data: {
                    color: CardColor.HEARTS,
                    number: 9
                }
            }
        };
        GameStore.state.playerCards = [];

        GameStore.handleAction(dummyPayload);

        expect(GameStore.state.status).to.equal(GameState.PLAYED_CARD);
    });

    it('should calculate team points and set Player to start next turn on broadcast stich', () => {
        let dummyPayload = {
            action: {
                actionType: JassAppConstants.BROADCAST_STICH,
                data: {
                    'name': 'Player 1',
                    'id': 1,
                    'playedCards': [
                      {
                          number: 11,
                          color: CardColor.HEARTS
                      }
                    ],
                    'teams': [
                        {
                            'name': 'Team 2',
                            'points': 157,
                            'currentRoundPoints': 0
                        },
                        {
                            'name': 'Team 1',
                            'points': 0,
                            'currentRoundPoints': 42
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

        expect(GameStore.state.status).to.equal(GameState.STICH);
        expect(GameStore.state.startingPlayerIndex).to.equal(0);
        expect(GameStore.state.nextStartingPlayerIndex).to.equal(1);
        expect(GameStore.state.teams[0].points).to.equal(dummyPayload.action.data.teams[1].points);
        expect(GameStore.state.teams[0].currentRoundPoints).to.equal(dummyPayload.action.data.teams[1].currentRoundPoints);
        expect(GameStore.state.teams[1].points).to.equal(dummyPayload.action.data.teams[0].points);
        expect(GameStore.state.teams[1].currentRoundPoints).to.equal(dummyPayload.action.data.teams[0].currentRoundPoints);
        expect(GameStore.state.lastStichCards).to.equal(dummyPayload.action.data.playedCards);
        expect(GameStore.state.lastStichStartingPlayerIndex).to.equal(0);

        let dummyPayload2 = {
            action: {
                actionType: JassAppConstants.PLAYED_CARDS
            }
        };

        GameStore.handleAction(dummyPayload2);

        expect(GameStore.state.startingPlayerIndex).to.equal(1);
        expect(GameStore.state.nextStartingPlayerIndex).to.equal(1);
    });

  it('should set last stich player index on broadcast stich', () => {
    let dummyPayload = {
      action: {
        actionType: JassAppConstants.BROADCAST_STICH,
        data: {
          'name': 'Player 2',
          'id': 2,
          'playedCards': [
            {
              number: 11,
              color: CardColor.HEARTS
            }
          ],
          'teams': [
            {
              'name': 'Team 2',
              'points': 157,
              'currentRoundPoints': 0
            },
            {
              'name': 'Team 1',
              'points': 0,
              'currentRoundPoints': 42
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
    GameStore.state.nextStartingPlayerIndex = 0;

    GameStore.handleAction(dummyPayload);

    expect(GameStore.state.lastStichStartingPlayerIndex).to.equal(0);
    expect(GameStore.state.nextStartingPlayerIndex).to.equal(2);
  });

    it('should set next roundPlayer after 9 cycles', () => {
        let dummyPayload = {
            action: {
                actionType: JassAppConstants.BROADCAST_STICH,
                data: {
                    'name': 'Player 1',
                    'id': 1,
                    'playedCards': [],
                    'teams': [
                        {
                            'name': 'Team 2',
                            'points': 157,
                            'currentRoundPoints': 0
                        },
                        {
                            'name': 'Team 1',
                            'points': 0,
                            'currentRoundPoints': 42
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
        GameStore.state.roundPlayerIndex = 3;
        GameStore.state.cyclesMade = 8;

        GameStore.handleAction(dummyPayload);

        expect(GameStore.state.status).to.equal(GameState.STICH);
        expect(GameStore.state.roundPlayerIndex).to.equal(0);
        expect(GameStore.state.nextStartingPlayerIndex).to.equal(0);
    });

    it('should set game mode and color to undefined when a game is finished', () => {
        const dummyPayload = {
            action: {
                actionType: JassAppConstants.BROADCAST_GAME_FINISHED
            }
        };

        GameStore.state.mode = 'TRUMPF';
        GameStore.state.color = CardColor.CLUBS;

        GameStore.handleAction(dummyPayload);

        expect(GameStore.state.mode).to.be.undefined;
        expect(GameStore.state.color).to.be.undefined;
    });

    it('should set winner on broadcast winner team', () => {
        const name = 'myTeam';
        const dummyPayload = {
            action: {
                actionType: JassAppConstants.BROADCAST_WINNER_TEAM,
                data: {
                    name
                }
            }
        };
        GameStore.state.teams = [
            { name: 'otherTeam' },
            { name }
        ];

        GameStore.handleAction(dummyPayload);

        expect(GameStore.state.teams[0].winner).to.be.undefined;
        expect(GameStore.state.teams[1].winner).to.equal(true);
    });

});