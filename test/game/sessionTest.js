'use strict';

let expect = require('chai').expect;
let Session = require('../../lib/game/session');
let ClientApi = require('../../lib/communication/clientApi');
let Game = require('../../lib/game/game');
let sinon = require('sinon');

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
        let clientApiMock,
            requestPlayerNamePromises = [
                Promise.resolve({playerName: 'Peter'}),
                Promise.resolve({playerName: 'Hans'}),
                Promise.resolve({playerName: 'Homer'}),
                Promise.resolve({playerName: 'Luke'})
            ];

        beforeEach(() => {
            clientApiMock = sinon.mock(session.clientApi);
            clientApiMock.expects("requestPlayerName").withExactArgs('webSocket').once().returns(requestPlayerNamePromises[0]);
            clientApiMock.expects("requestPlayerName").withExactArgs('webSocket').once().returns(requestPlayerNamePromises[1]);
            clientApiMock.expects("requestPlayerName").withExactArgs('webSocket').once().returns(requestPlayerNamePromises[2]);
            clientApiMock.expects("requestPlayerName").withExactArgs('webSocket').once().returns(requestPlayerNamePromises[3]);
        });

        it('should add alternating team to player and ask for player name', (done) => {
            session.addPlayer('webSocket');
            session.addPlayer('webSocket');
            session.addPlayer('webSocket');
            session.addPlayer('webSocket');

            clientApiMock.verify();

            expect(session.players[0].team).to.equal(session.teams[0]);
            expect(session.players[1].team).to.equal(session.teams[1]);
            expect(session.players[2].team).to.equal(session.teams[0]);
            expect(session.players[3].team).to.equal(session.teams[1]);

            Promise.all(requestPlayerNamePromises).then(() => {
                expect(session.players[0].name).to.equal('Peter');
                expect(session.players[1].name).to.equal('Hans');
                expect(session.players[2].name).to.equal('Homer');
                expect(session.players[3].name).to.equal('Luke');

                done();
            }).catch(done);
        });

        describe('isComplete', () => {
            it('should mark session as complete when four players are added', () => {
                session.addPlayer('webSocket');
                expect(session.isComplete()).to.equal(false);

                session.addPlayer('webSocket');
                expect(session.isComplete()).to.equal(false);

                session.addPlayer('webSocket');
                expect(session.isComplete()).to.equal(false);

                session.addPlayer('webSocket');
                expect(session.isComplete()).to.equal(true);

                clientApiMock.verify();
            });
        });

        afterEach(() => {
            clientApiMock.restore();
        });
    });

    describe('startGame', () => {
        it('should fail if session is not complete', () => {
            expect(() => {
                session.start();
            }).to.throw('Not enough players to start game!');
        });
    });
});