import { expect } from 'chai';
import sinon from 'sinon';
import * as TournamentSession from '../../../server/session/tournamentSession';
import * as SingleGameSession from '../../../server/session/singleGameSession';

describe('tournamentSession', () => {

    let session,
        clientApiMock,
        singleGameSessionFactoryMock,
        createWebSocketDummy = () => ({
            send() {
            }
        }),
        webSocketDummy = createWebSocketDummy(),
        webSocketDummy2 = createWebSocketDummy();

    beforeEach(() => {
        session = TournamentSession.create('sessionName');
        clientApiMock = sinon.mock(session.clientApi);
        singleGameSessionFactoryMock = sinon.mock(SingleGameSession);
    });

    afterEach(() => {
        clientApiMock.restore();
        singleGameSessionFactoryMock.restore();
    });

    describe('calculateGameCount', () => {
        it('should calculate number of games with one round', () => {
            session.players = [1, 2, 3];
            session.rounds = 1;

            let actual = session.calculateGameCount();

            expect(actual).to.equal(3);
        });

        it('should calculate number of games with 10 rounds', () => {
            session.players = [1, 2, 3, 4, 5];
            session.rounds = 10;

            let actual = session.calculateGameCount();

            expect(actual).to.equal(100);
        });
    });

    describe('create', () => {
        it('should initialize name and players', () => {
            let sessionName = 'sessionName';

            let session = TournamentSession.create(sessionName);

            expect(session.name).to.equal(sessionName);
            expect(session.players).to.eql([]);
            expect(session.spectators).to.eql([]);
        });
    });

    describe('addPlayer', () => {

        let playerName = 'playerName';

        it('should add player to clientApi, rankingTable and broadcast rankingTable', () => {
            clientApiMock.expects('addClient').withArgs(webSocketDummy).once().returns(Promise.resolve());
            clientApiMock.expects('broadcastTournamentRankingTable').withArgs(session.rankingTable).once();

            session.addPlayer(webSocketDummy, playerName);

            expect(session.rankingTable.ranking).to.have.length(1);
            clientApiMock.verify();
        });

        it('should add object to player array', () => {
            session.addPlayer(webSocketDummy, playerName);

            expect(session.players[0]).to.eql({
                playerName,
                isPlaying: false,
                connected: true,
                clients: [
                    webSocketDummy
                ]
            });
        });

        it('should add client to already existing playerName', () => {
            session.addPlayer(webSocketDummy, playerName);
            session.addPlayer(webSocketDummy2, playerName);

            expect(session.players).to.have.length(1);
            expect(session.players[0]).to.eql({
                playerName,
                isPlaying: false,
                connected: true,
                clients: [
                    webSocketDummy,
                    webSocketDummy2
                ]
            });
        });

        it('should remove player and ranking when clients disconnect before play', (done) => {
            let rejectedPromise = Promise.reject();
            clientApiMock.expects('addClient').withArgs(webSocketDummy).once().returns(rejectedPromise);
            clientApiMock.expects('broadcastTournamentRankingTable').twice();

            session.addPlayer(webSocketDummy, playerName);

            rejectedPromise.catch(() => {
                expect(session.players).to.have.lengthOf(0);
                expect(session.rankingTable.ranking).to.have.lengthOf(0);
                clientApiMock.verify();
                done();
            }).catch(done);
        });

        it('should remove client from clients array when one client disconnects before play', (done) => {
            let rejectedPromise = Promise.reject();
            clientApiMock.expects('addClient').withArgs(webSocketDummy).once().returns(Promise.resolve());
            clientApiMock.expects('addClient').withArgs(webSocketDummy2).once().returns(rejectedPromise);
            clientApiMock.expects('broadcastTournamentRankingTable').thrice();

            session.addPlayer(webSocketDummy, playerName);
            session.addPlayer(webSocketDummy2, playerName);

            rejectedPromise.catch(() => {
                expect(session.players).to.have.lengthOf(1);
                expect(session.players[0].clients).to.have.lengthOf(1);
                expect(session.rankingTable.ranking).to.have.lengthOf(1);
                clientApiMock.verify();
                done();
            }).catch(done);
        });

        it('should close connections and mark player offline when one of its clients disconnects during play', (done) => {
            let rejectedPromise = Promise.reject();
            clientApiMock.expects('addClient').withArgs(webSocketDummy).once().returns(Promise.resolve());
            clientApiMock.expects('addClient').withArgs(webSocketDummy).once().returns(rejectedPromise);
            clientApiMock.expects('removeClient').withArgs(webSocketDummy, sinon.match.string).twice();
            clientApiMock.expects('broadcastTournamentRankingTable').thrice();
            session.started = true;

            session.addPlayer(webSocketDummy, playerName);
            session.addPlayer(webSocketDummy, playerName);

            rejectedPromise.catch(() => {
                expect(session.players[0].connected).to.equal(false);
                expect(session.rankingTable.ranking[0].crashed).to.equal(true);
                clientApiMock.verify();
                done();
            }).catch(done);
        });

        it('should not add client to already existing playerName with two clients', () => {
            const webSocketDummy3 = createWebSocketDummy();
            clientApiMock.expects('removeClient').withArgs(webSocketDummy3, sinon.match.string).once();

            session.addPlayer(webSocketDummy, playerName);
            session.addPlayer(webSocketDummy2, playerName);
            session.addPlayer(webSocketDummy3, playerName);

            expect(session.players).to.have.length(1);
            expect(session.players[0].clients).to.have.length(2);
            clientApiMock.verify();
        });
    });

    describe('addSpectator', () => {
        it('should add spectator to clientapi', () => {
            clientApiMock.expects('addClient').withArgs(webSocketDummy).once();
            clientApiMock.expects('sendTournamentRankingTable').withArgs(webSocketDummy, session.rankingTable).once();

            session.addSpectator(webSocketDummy);

            clientApiMock.verify();
        });

        it('should add spectator to spectator array', () => {
            clientApiMock.expects('addClient');

            session.addSpectator(webSocketDummy);

            expect(session.spectators).to.have.length(1);
            expect(session.spectators[0]).to.equal(webSocketDummy);
        });
    });

    describe('isComplete', () => {
        let playerName1 = 'playerName1',
            playerName2 = 'playerName2';

        it('should return false if any players without 2 clients', () => {
            session.addPlayer(webSocketDummy, playerName1);
            session.addPlayer(webSocketDummy, playerName2);
            session.addPlayer(webSocketDummy, playerName1);

            expect(session.isComplete()).to.equal(false);
        });

        it('should return false if any players without 2 clients', () => {
            session.addPlayer(webSocketDummy, playerName1);
            session.addPlayer(webSocketDummy, playerName1);
            session.addPlayer(webSocketDummy, playerName2);
            session.addPlayer(webSocketDummy, playerName2);

            expect(session.isComplete()).to.equal(true);
        });
    });

    describe('close', () => {
        it('should call clientapi closeAll', () => {
            let message = 'message',
                code = 'code';

            clientApiMock.expects('closeAll').withArgs(message).once();

            session.close(message);

            clientApiMock.verify();
        });
    });

    describe('start', () => {

        it('should add players to ranking, set started to true and broadcast', () => {
            let player1 = 'playerName1',
                player2 = 'playerName2';

            singleGameSessionFactoryMock.expects('create').returns({
                addPlayer() {
                },
                start() {
                    return Promise.resolve({
                        name: player1
                    });
                },
                dispose() {
                },
            });

            clientApiMock.expects('broadcastTournamentStarted').once();

            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player2);
            session.addPlayer(webSocketDummy, player2);

            session.start();

            expect(session.ranking.ranking.getPlayers()).to.have.length(2);
            expect(session.started).to.equal(true);
            clientApiMock.verify();
            singleGameSessionFactoryMock.verify();
        });

        it('should create pairings with round-robin', () => {
            let player1 = 'playerName1',
                player2 = 'playerName2',
                player3 = 'playerName3';

            singleGameSessionFactoryMock.expects('create').returns({
                addPlayer() {
                },
                start() {
                    return Promise.resolve({
                        name: player1
                    });
                },
                dispose() {
                },
            });

            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player2);
            session.addPlayer(webSocketDummy, player2);
            session.addPlayer(webSocketDummy, player3);
            session.addPlayer(webSocketDummy, player3);

            session.start();

            expect(session.pairings).to.have.length(3);
        });

        it('should start session with players who are not playing', done => {
            let player1 = 'playerName1',
                player2 = 'playerName2',
                player3 = 'playerName3',
                addPlayerSpy = sinon.spy(),
                resolvedPromise = Promise.resolve({
                    name: player3
                });

            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player2);
            session.addPlayer(webSocketDummy, player2);
            session.addPlayer(webSocketDummy, player3);
            session.addPlayer(webSocketDummy, player3);

            session.players[1].isPlaying = true;

            singleGameSessionFactoryMock.expects('create').withArgs(sinon.match.string).once().returns({
                addPlayer: addPlayerSpy,
                start() {
                    return resolvedPromise;
                },
                dispose() {
                },
            });

            session.start();

            expect(addPlayerSpy.calledWith(webSocketDummy, player1)).to.equal(true);
            expect(addPlayerSpy.calledWith(webSocketDummy, player3)).to.equal(true);
            expect(session.players[0].isPlaying).to.equal(true);
            expect(session.players[2].isPlaying).to.equal(true);
            singleGameSessionFactoryMock.verify();
            resolvedPromise.then(() => {
                expect(session.players[0].isPlaying).to.equal(false);
                expect(session.players[2].isPlaying).to.equal(false);
                expect(session.pairings).to.have.length(2);

                done();
            }).catch(done);
        });

        it('should remove pairings after session finished', done => {
            let player1 = 'playerName1',
                player2 = 'playerName2',
                player3 = 'playerName3',
                addPlayerSpy = sinon.spy(),
                resolvedPromise = Promise.resolve({
                    name: player3
                });

            session.rounds = 3;

            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player2);
            session.addPlayer(webSocketDummy, player2);
            session.addPlayer(webSocketDummy, player3);
            session.addPlayer(webSocketDummy, player3);

            session.players[1].isPlaying = true;

            singleGameSessionFactoryMock.expects('create').withArgs(sinon.match.string).once().returns({
                addPlayer: addPlayerSpy,
                start() {
                    return resolvedPromise;
                },
                dispose() {
                },
            });

            session.start();
            expect(session.pairings).to.have.length(9);

            expect(addPlayerSpy.calledWith(webSocketDummy, player1)).to.equal(true);
            expect(addPlayerSpy.calledWith(webSocketDummy, player3)).to.equal(true);
            singleGameSessionFactoryMock.verify();
            resolvedPromise.then(() => {
                expect(session.pairings).to.have.length(8);
                done();
            }).catch(done);
        });

        it('should cleanup after pairing', done => {
            const player1 = 'playerName1';
            const player2 = 'playerName2';
            const addPlayerSpy = sinon.spy();
            const resolvedPromise = Promise.resolve({
                name: player2
            });
            const disposeSpy = sinon.spy();

            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player1);
            session.addPlayer(webSocketDummy, player2);
            session.addPlayer(webSocketDummy, player2);

            singleGameSessionFactoryMock.expects('create').withArgs(sinon.match.string).once().returns({
                addPlayer: addPlayerSpy,
                start() {
                    return resolvedPromise;
                },
                dispose: disposeSpy,
            });

            const sessionPromise = session.start();

            singleGameSessionFactoryMock.verify();
            sessionPromise.then(() => {
                sinon.assert.calledOnce(disposeSpy);
                done();
            }).catch(done);
        });
    });
});
