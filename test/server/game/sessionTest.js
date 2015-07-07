'use strict';

let expect = require('chai').expect;
let Session = require('../../../server/game/session');
let ClientApi = require('../../../server/communication/clientApi');
let Game = require('../../../server/game/game');
let TestDataCreator = require('../../testDataCreator');
let sinon = require('sinon');
let CloseEventCode = require('../../../server/communication/closeEventCode');


describe('Session', function () {
    let session;

    beforeEach(() => {
        session = Session.create();
    });

    describe('create', () => {
        it('should initialize player and team array', () => {
            expect(session.players).to.have.length(0);
            expect(session.teams).to.have.length(2);
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
        });

        describe('isComplete', () => {
            it('should mark session as complete when four players are added', () => {
                var playerName = 'player';
                session.addPlayer('webSocket', playerName);
                expect(session.isComplete()).to.equal(false);

                session.addPlayer('webSocket', playerName);
                expect(session.isComplete()).to.equal(false);

                session.addPlayer('webSocket', playerName);
                expect(session.isComplete()).to.equal(false);

                session.addPlayer('webSocket', playerName);
                expect(session.isComplete()).to.equal(true);
            });
        });
    });

    describe('start', () => {
        let gameFactoryMock,
            clientApiMock,
            fourPlayers;

        beforeEach(function () {
            gameFactoryMock = sinon.mock(Game);
            clientApiMock = sinon.mock(session.clientApi);
            fourPlayers = TestDataCreator.createPlayers(clientApiMock);
        });

        afterEach(function () {
            gameFactoryMock.restore();
            clientApiMock.restore();
        });

        it('should fail if session is not complete', () => {
            expect(() => {
                session.start();
            }).to.throw('Not enough players to start game!');
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

            session.players = fourPlayers;

            session.start().then((winningTeam) => {
                expect(winningTeam).to.eql(session.teams[1]);
                clientApiMock.verify();
                done();
            }).catch(done);
        });


    });

    describe('close', () => {
        it('should close all client connections',() => {
            let clientApiMock = sinon.mock(session.clientApi);

            clientApiMock.expects('closeAll').once().withArgs(CloseEventCode.NORMAL, 'Game Finished');
            session.close();
            clientApiMock.verify();

        });


    });


});