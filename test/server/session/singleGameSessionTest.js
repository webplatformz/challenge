'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import SingleGameSession from '../../../server/session/singleGameSession.js';
import ClientApi from '../../../server/communication/clientApi.js';
import Game from '../../../server/game/game.js';
import TestDataCreator from '../../testDataCreator.js';
import CloseEventCode from '../../../server/communication/closeEventCode.js';
import SessionType from '../../../shared/session/sessionType.js';

describe('Session', function () {
    let session,
        fourPlayers,
        clientApiMock;

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

        it('should add alternating team to player and ask for player name', () => {
            var playerName0 = 'Peter';
            var playerName1 = 'Hans';
            var playerName2 = 'Homer';
            var playerName3 = 'Luke';

            clientApiMock.expects('broadcastSessionJoined').exactly(4);
            clientApiMock.expects('addClient').exactly(4).returns(Promise.resolve());

            session.addPlayer('webSocket', playerName0);
            session.addPlayer('webSocket', playerName1);
            session.addPlayer('webSocket', playerName2);
            session.addPlayer('webSocket', playerName3);

            expect(session.players[0].team).to.equal(session.teams[0]);
            expect(session.players[0].name).to.equal(playerName0);
            expect(session.players[1].team).to.equal(session.teams[1]);
            expect(session.players[1].name).to.equal(playerName1);
            expect(session.players[2].team).to.equal(session.teams[0]);
            expect(session.players[2].name).to.equal(playerName2);
            expect(session.players[3].team).to.equal(session.teams[1]);
            expect(session.players[3].name).to.equal(playerName3);

            clientApiMock.verify();
        });

        it('should broadcast session joined', () => {
            let sessionPlayer = {
                id: 0,
                name: 'name'
            };

            clientApiMock.expects('broadcastSessionJoined').once().withArgs(session.name, sessionPlayer, [sessionPlayer]);
            clientApiMock.expects('addClient').once().returns(Promise.resolve());

            session.addPlayer('webSocket', sessionPlayer.name);

            clientApiMock.verify();
        });

        it('should close session if player left', (done) => {
            var rejectedPromise = Promise.reject({
                code: 0,
                message: 'message'
            });

            clientApiMock.expects('broadcastSessionJoined').once();
            clientApiMock.expects('addClient').once().returns(rejectedPromise);
            clientApiMock.expects('broadcastWinnerTeam').once();
            clientApiMock.expects('closeAll').once();

            session.addPlayer('webSocket', 'playerName');

            setTimeout(() => {
                clientApiMock.verify();
                done();
            }, 1);
        });
    });

    describe('isComplete', () => {
        it('should mark session as complete when four players are added', () => {
            var playerName = 'player';

            clientApiMock.expects('broadcastSessionJoined').exactly(4);
            clientApiMock.expects('addClient').exactly(4).returns(Promise.resolve());

            session.addPlayer('webSocket', playerName);
            expect(session.isComplete()).to.equal(false);

            session.addPlayer('webSocket', playerName);
            expect(session.isComplete()).to.equal(false);

            session.addPlayer('webSocket', playerName);
            expect(session.isComplete()).to.equal(false);

            session.addPlayer('webSocket', playerName);
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
                                id: fourPlayers[0].id
                            }, {
                                name: fourPlayers[2].name,
                                id: fourPlayers[2].id
                            }
                        ]
                    }, {
                        name: session.teams[1].name,
                        players: [
                            {
                                name: fourPlayers[1].name,
                                id: fourPlayers[1].id
                            }, {
                                name: fourPlayers[3].name,
                                id: fourPlayers[3].id
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
            clientApiMock.expects('closeAll').once();

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
            var code = CloseEventCode.NORMAL;
            var message = 'Game Finished';
            clientApiMock.expects('closeAll').once().withArgs(code, message);

            session.close(code, message);

            clientApiMock.verify();
        });
    });

    describe('handlePlayerLeft', () => {
        it('should broadcast opposite team as winners', () => {
            let code = CloseEventCode.ABNORMAL,
                message = 'message';

            clientApiMock.expects('broadcastWinnerTeam').once().withArgs(fourPlayers[1].team);
            clientApiMock.expects('closeAll').once().withArgs(code, message);

            session.handlePlayerLeft(fourPlayers[0], code, message);

            clientApiMock.verify();
        });
    });

    describe('addSpectator', () => {
        it('should add Spectator to clients', () => {
            let webSocket = 'webSocket';
            clientApiMock.expects('addClient').once().withArgs(webSocket);
            session.addSpectator(webSocket);

            clientApiMock.verify();
        });
    });
});