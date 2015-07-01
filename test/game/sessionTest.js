'use strict';

let expect = require('chai').expect;
let Session = require('../../lib/game/session');
let ClientApi = require('../../lib/communication/clientApi');
let Game = require('../../lib/game/game');
let TestDataCreator = require('../testDataCreator');
let sinon = require('sinon');


describe.only('Session', function() {
    let session;

    beforeEach(function(){
        session = Session.create();
    });

    describe('create', () => {
        it('should initialize player and team array', () => {
            expect(session.players).to.have.length(0);
            expect(session.teams).to.have.length(2);
        });
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
        it('should add alternating team to player', () => {
            session.addPlayer('webSocket');
            session.addPlayer('webSocket');
            session.addPlayer('webSocket');
            session.addPlayer('webSocket');

            expect(session.players[0].team).to.equal(session.teams[0]);
            expect(session.players[1].team).to.equal(session.teams[1]);
            expect(session.players[2].team).to.equal(session.teams[0]);
            expect(session.players[3].team).to.equal(session.teams[1]);
        });
    });

    describe('start', () => {
        let gameFactoryMock;
        let clientApiMock;

        beforeEach(function () {
            gameFactoryMock = sinon.mock(Game);
            clientApiMock = sinon.mock(ClientApi);
        });

        it('should fail if session is not complete', () => {
             expect(() => { session.start(); }).to.throw('Not enough players to start game!');
        });

        it('should finish a game after max points have been reached', (done) => {
            let fourPlayers = TestDataCreator.createPlayers(clientApiMock);

            let game = {
                start: function() {
                    session.teams[0].points += 1000;
                    return Promise.resolve('someTeam');
                }
            };

            gameFactoryMock.expects('create').exactly(3).returns(game);

            session.players = fourPlayers;

            session.start().then(() => {

                done();
            }).catch(done);
        });

        afterEach(function () {
            gameFactoryMock.restore();
            clientApiMock.restore();
        });
    });


});