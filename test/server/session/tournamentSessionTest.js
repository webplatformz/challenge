'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import TournamentSession from '../../../server/session/tournamentSession.js';
import CloseEventCode from '../../../server/communication/closeEventCode.js';
import Ranking from '../../../server/game/ranking/ranking.js';
import RankingTable from '../../../server/session/rankingTable.js';
import SingleGameSession from '../../../server/session/singleGameSession.js';
import SessionType from '../../../shared/session/sessionType.js';

describe('tournamentSession', () => {

    let session,
        clientApiMock,
        singleGameSessionMock,
        webSocketDummy = {
            send() {}
        };

    beforeEach(() => {
        session = TournamentSession.create('sessionName');
        clientApiMock = sinon.mock(session.clientApi);
        singleGameSessionMock = sinon.mock(SingleGameSession);
    });

    afterEach(() => {
        clientApiMock.restore();
        singleGameSessionMock.restore();
    });

    describe('calculateGameCount', () => {
        it('should calculate number of games with one round', () => {
            session.players = [1,2,3];
            session.rounds = 1;

            let actual = session.calculateGameCount();

            expect(actual).to.equal(3);
        });

        it('should calculate number of games with 10 rounds', () => {
            session.players = [1,2,3,4,5];
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
            session.addPlayer(webSocketDummy, playerName);

            expect(session.players).to.have.length(1);
            expect(session.players[0]).to.eql({
                playerName,
                isPlaying: false,
                connected: true,
                clients: [
                    webSocketDummy,
                    webSocketDummy
                ]
            });
        });

        it('should close connections and mark player offline when one of its clients disconnects', (done) => {
            let rejectedPromise = Promise.reject();
            clientApiMock.expects('addClient').withArgs(webSocketDummy).once().returns(Promise.resolve());
            clientApiMock.expects('addClient').withArgs(webSocketDummy).once().returns(rejectedPromise);
            clientApiMock.expects('removeClient').withArgs(webSocketDummy, CloseEventCode.ABNORMAL, sinon.match.string).twice();

            session.addPlayer(webSocketDummy, playerName);
            session.addPlayer(webSocketDummy, playerName);

            rejectedPromise.catch(() => {
                expect(session.players[0].connected).to.equal(false);
                clientApiMock.verify();
                done();
            }).catch(done);
        });

        it('should not add client to already existing playerName with two clients', () => {
            clientApiMock.expects('removeClient').withArgs(webSocketDummy, CloseEventCode.ABNORMAL, sinon.match.string).once();

            session.addPlayer(webSocketDummy, playerName);
            session.addPlayer(webSocketDummy, playerName);
            session.addPlayer(webSocketDummy, playerName);

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

            clientApiMock.expects('closeAll').withArgs(code, message).once();

            session.close(code, message);

            clientApiMock.verify();
        });
    });

    describe('start', () => {

        it('should add players to ranking, set started to true and broadcast', () => {
            let player1 = 'playerName1',
                player2 = 'playerName2';

            singleGameSessionMock.expects('create').returns({
                addPlayer() {},
                start() {
                    return Promise.resolve();
                }
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
        });

        it('should create pairings with round-robin', () => {
            let player1 = 'playerName1',
                player2 = 'playerName2',
                player3 = 'playerName3';

            singleGameSessionMock.expects('create').returns({
                addPlayer() {},
                start() {
                    return Promise.resolve();
                }
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

            singleGameSessionMock.expects('create').withArgs(sinon.match.string).once().returns({
                addPlayer: addPlayerSpy,
                start() {
                    return resolvedPromise;
                }
            });

            session.start();

            expect(addPlayerSpy.calledWith(webSocketDummy, player1)).to.equal(true);
            expect(addPlayerSpy.calledWith(webSocketDummy, player3)).to.equal(true);
            expect(session.players[0].isPlaying).to.equal(true);
            expect(session.players[2].isPlaying).to.equal(true);
            singleGameSessionMock.verify();
            resolvedPromise.then(() => {
                expect(session.players[0].isPlaying).to.equal(false);
                expect(session.players[2].isPlaying).to.equal(false);
                expect(session.pairings).to.have.length(2);

                done();
            }).catch(done);
        });
    });
});
