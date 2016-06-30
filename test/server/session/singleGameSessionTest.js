import {expect} from 'chai';
import sinon from 'sinon';
import * as SingleGameSession from '../../../server/session/singleGameSession';
import * as Game from '../../../server/game/game';
import * as TestDataCreator from '../../testDataCreator';
import CloseEventCode from '../../../server/communication/closeEventCode';
import {SessionType} from '../../../shared/session/sessionType';
import {MessageType} from '../../../shared/messages/messageType';

describe('Session', function () {
    let session,
        fourPlayers,
        clientApiMock;

    const webSocketDummy = {
        on() {}
    };

    beforeEach(() => {
        session = SingleGameSession.create('TestSession');
        clientApiMock = sinon.mock(session.clientApi);
        fourPlayers = TestDataCreator.createPlayers(clientApiMock);
    });

    afterEach(() => {
        clientApiMock.restore();
    });

    describe('create', () => {
        it('should initialize player and team array and have default sessiontype', () => {
            expect(session.players).to.have.length(0);
            expect(session.teams).to.have.length(2);
            expect(session.type).to.equal(SessionType.SINGLE_GAME);
        });
    });

    describe('getNextStartingPlayer', () => {
        it('should increment starting player from 0 to 3 and start over', () => {
            expect(session.getNextStartingPlayer()).to.equal(0);
            expect(session.getNextStartingPlayer()).to.equal(1);
            expect(session.getNextStartingPlayer()).to.equal(2);
            expect(session.getNextStartingPlayer()).to.equal(3);
            expect(session.getNextStartingPlayer()).to.equal(0);
        });
    });

    describe('addPlayer', () => {

        const playerName0 = 'Peter';
        const playerName1 = 'Hans';
        const playerName2 = 'Homer';
        const playerName3 = 'Luke';
        const team1 = 0;
        const team2 = 1;


        function expectClientApiMockToAdd4Players() {
            clientApiMock.expects('broadcastSessionJoined').exactly(4);
            clientApiMock.expects('addClient').exactly(4).returns(Promise.resolve());
        }

        function expectPlayerInTeam(playerIndex, playerName, teamIndex) {
            const player = session.players.find(player => player.name === playerName);
            expect(player.team).to.equal(session.teams[teamIndex]);
        }

        it('should add players in order to alternating teams', () => {
            expectClientApiMockToAdd4Players();

            session.addPlayer(webSocketDummy, playerName0);
            session.addPlayer(webSocketDummy, playerName1);
            session.addPlayer(webSocketDummy, playerName2);
            session.addPlayer(webSocketDummy, playerName3);

            expectPlayerInTeam(0, playerName0, team1);
            expectPlayerInTeam(1, playerName1, team2);
            expectPlayerInTeam(2, playerName2, team1);
            expectPlayerInTeam(3, playerName3, team2);

            clientApiMock.verify();
        });

        it('should add players to chosen teams', () => {
            expectClientApiMockToAdd4Players();

            session.addPlayer(webSocketDummy, playerName0, team2);
            session.addPlayer(webSocketDummy, playerName1, team2);
            session.addPlayer(webSocketDummy, playerName2, team1);
            session.addPlayer(webSocketDummy, playerName3, team1);

            expectPlayerInTeam(0, playerName2, team1);
            expectPlayerInTeam(1, playerName0, team2);
            expectPlayerInTeam(2, playerName3, team1);
            expectPlayerInTeam(3, playerName1, team2);

            clientApiMock.verify();
        });

        it('should assign first free team slot to player choosing full team', () => {
            expectClientApiMockToAdd4Players();

            session.addPlayer(webSocketDummy, playerName0, team2);
            session.addPlayer(webSocketDummy, playerName1, team1);
            session.addPlayer(webSocketDummy, playerName2, team2);
            session.addPlayer(webSocketDummy, playerName3, team2);

            expectPlayerInTeam(0, playerName1, team1);
            expectPlayerInTeam(1, playerName0, team2);
            expectPlayerInTeam(2, playerName3, team1);
            expectPlayerInTeam(3, playerName2, team2);

            clientApiMock.verify();
        });

        it('should assign first free team slot to player when no team chosen', () => {
            expectClientApiMockToAdd4Players();

            session.addPlayer(webSocketDummy, playerName0, team2);
            session.addPlayer(webSocketDummy, playerName1);
            session.addPlayer(webSocketDummy, playerName2, team1);
            session.addPlayer(webSocketDummy, playerName3);

            expectPlayerInTeam(0, playerName1, team1);
            expectPlayerInTeam(1, playerName0, team2);
            expectPlayerInTeam(2, playerName2, team1);
            expectPlayerInTeam(3, playerName3, team2);

            clientApiMock.verify();
        });


        it('should broadcast session joined and save message for later use', () => {
            let sessionPlayer = {
                id: 0,
                seatId: 0,
                name: 'name'
            };

            let playerMatcher = sinon.match(function (actualPlayer) {
                return actualPlayer.seatId === sessionPlayer.seatId &&
                    actualPlayer.name === sessionPlayer.name
            });

            clientApiMock.expects('broadcastSessionJoined').once().withArgs(session.name, playerMatcher, [playerMatcher]);
            clientApiMock.expects('addClient').once().returns(Promise.resolve());

            session.addPlayer(webSocketDummy, sessionPlayer.name);

            clientApiMock.verify();
            expect(session.lastSessionJoin.player).to.have.keys('id', 'seatId', 'name');
            expect(session.lastSessionJoin.player).to.have.property('seatId', sessionPlayer.seatId);
            expect(session.lastSessionJoin.player).to.have.property('name', sessionPlayer.name);
            expect(session.lastSessionJoin.playersInSession.length).to.eq(1);
        });

        it('should close session if player left', (done) => {
            var rejectedPromise = Promise.reject({
                code: 0,
                message: 'message'
            });

            clientApiMock.expects('broadcastSessionJoined').once();
            clientApiMock.expects('addClient').once().returns(rejectedPromise);
            clientApiMock.expects('broadcastWinnerTeam').once();

            session.addPlayer(webSocketDummy, 'playerName');

            setTimeout(() => {
                clientApiMock.verify();
                done();
            }, 1);
        });

        it('should assign first free team slot to player when no team chosen', () => {
            expectClientApiMockToAdd4Players();

            clientApiMock.expects('subscribeMessage').exactly(4).withExactArgs(webSocketDummy, MessageType.JOIN_BOT, sinon.match.func);

            session.addPlayer(webSocketDummy, playerName0);
            session.addPlayer(webSocketDummy, playerName1);
            session.addPlayer(webSocketDummy, playerName2);
            session.addPlayer(webSocketDummy, playerName3);

            expect(session.joinBotListeners.length).to.equal(4);

            clientApiMock.verify();
        });
    });

    describe('isComplete', () => {
        it('should mark session as complete when four players are added', () => {
            var playerName = 'player';

            clientApiMock.expects('broadcastSessionJoined').exactly(4);
            clientApiMock.expects('addClient').exactly(4).returns(Promise.resolve());

            session.addPlayer(webSocketDummy, playerName);
            expect(session.isComplete()).to.equal(false);

            session.addPlayer(webSocketDummy, playerName);
            expect(session.isComplete()).to.equal(false);

            session.addPlayer(webSocketDummy, playerName);
            expect(session.isComplete()).to.equal(false);

            session.addPlayer(webSocketDummy, playerName);
            expect(session.isComplete()).to.equal(true);

            clientApiMock.verify();
        });
    });

    describe('start', () => {
        let gameFactoryMock;

        beforeEach(function () {
            gameFactoryMock = sinon.mock(Game);
        });

        afterEach(function () {
            gameFactoryMock.restore();
        });

        it('should fail if session is not complete', () => {
            expect(() => {
                session.start();
            }).to.throw('Not enough players to start game!');
        });

        it('should broadcast teams', (done) => {
            let game = {
                    start: function () {
                        session.teams[0].points += 1000;
                        return Promise.resolve();
                    }
                },
                teams = [
                    {
                        name: session.teams[0].name,
                        players: [
                            {
                                name: fourPlayers[0].name,
                                id: fourPlayers[0].id,
                                seatId: fourPlayers[0].seatId
                            }, {
                                name: fourPlayers[2].name,
                                id: fourPlayers[2].id,
                                seatId: fourPlayers[2].seatId
                            }
                        ]
                    }, {
                        name: session.teams[1].name,
                        players: [
                            {
                                name: fourPlayers[1].name,
                                id: fourPlayers[1].id,
                                seatId: fourPlayers[1].seatId
                            }, {
                                name: fourPlayers[3].name,
                                id: fourPlayers[3].id,
                                seatId: fourPlayers[3].seatId
                            }
                        ]
                    }
                ];

            session.players = fourPlayers;

            gameFactoryMock.expects('create').exactly(3).returns(game);
            clientApiMock.expects('broadcastTeams').once().withArgs(teams);
            clientApiMock.expects('broadcastWinnerTeam').once();

            session.start().then(() => {
                clientApiMock.verify();
                done();
            }).catch(done);
        });

        it('should finish a game after max points have been reached', (done) => {
            let game = {
                start: function () {
                    session.teams[0].points += 1000;
                    return Promise.resolve();
                }
            };

            gameFactoryMock.expects('create').exactly(3).returns(game);

            session.players = fourPlayers;

            session.start().then((winningTeam) => {
                expect(winningTeam).to.eql(session.teams[0]);
                done();
            }).catch(done);
        });

        it('should unbind all joinBotListeners', () => {
            const game = {
                start: function () {
                    return Promise.resolve();
                }
            };
            const unbindSpy = sinon.spy();

            gameFactoryMock.expects('create').returns(game);
            session.joinBotListeners.push(unbindSpy);
            session.players = fourPlayers;

            session.start();

            sinon.assert.calledOnce(unbindSpy);
        });


        it('should finish a game and check better team wins', (done) => {
            let game = {
                start: function () {
                    session.teams[0].points += 1000;
                    session.teams[1].points += 1001;
                    return Promise.resolve();
                }
            };

            gameFactoryMock.expects('create').exactly(3).returns(game);
            clientApiMock.expects('broadcastWinnerTeam').once();

            session.players = fourPlayers;

            session.start().then((winningTeam) => {
                expect(winningTeam).to.eql(session.teams[1]);
                clientApiMock.verify();
                done();
            }).catch(done);
        });


    });

    describe('close', () => {
        it('should close all client connections', () => {
            let message = 'Game Finished';
            clientApiMock.expects('closeAll').once().withArgs(message);

            session.close(message);

            clientApiMock.verify();
        });
    });

    describe('handlePlayerLeft', () => {
        it('should broadcast opposite team as winners', () => {
            let code = CloseEventCode.NORMAL,
                message = 'message';
            session.started = true;
            session.cancelGame = sinon.spy();

            clientApiMock.expects('broadcastWinnerTeam').once().withArgs(fourPlayers[1].team);

            session.handlePlayerLeft(fourPlayers[0], code, message);

            clientApiMock.verify();
            sinon.assert.calledOnce(session.cancelGame);
        });
    });

    describe('addSpectator', () => {
        it('should add Spectator to clients and send sessionJoined', () => {
            session.lastSessionJoin = {
                player: 'player',
                playersInSession: [
                    'player'
                ]
            };

            clientApiMock.expects('addClient').once().withArgs(webSocketDummy);
            clientApiMock.expects('sessionJoined').once().withArgs(webSocketDummy, session.name, session.lastSessionJoin.player, session.lastSessionJoin.playersInSession);

            session.addSpectator(webSocketDummy);

            clientApiMock.verify();
        });
    });
});