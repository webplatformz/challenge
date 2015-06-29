'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let Session = require('../../lib/game/session');
let ClientApi = require('../../lib/communication/clientApi');
let Game = require('../../lib/game/game');

describe('Session', function() {
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

    describe('addPlayer', () => {
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

    describe('startGame', () => {
        it('should fail if session is not complete', () => {
             expect(() => { session.startGame(); }).to.throw('Not enough players to start game!');
        });
    });

    describe('startGame', () => {

        let clientApiMock,
            gameMock,
            clients = ['ws1','ws2', 'ws3', 'ws4'];

        beforeEach(() => {
            clientApiMock = sinon.mock(ClientApi);
            gameMock = sinon.mock(Game);

            session.addPlayer(clients[0]);
            session.addPlayer(clients[1]);
            session.addPlayer(clients[2]);
            session.addPlayer(clients[3]);
        });

        it('should create new clientApi and new game when first game is started', () => {
            var clientApiInstance = {clientApiInstance: 'instance'};
            clientApiMock.expects('create').withArgs(clients).returns(clientApiInstance).once();
            gameMock.expects('create').withArgs(session.players, session.maxPoints, session.players[0], clientApiInstance).once();

            session.startGame();

            clientApiMock.verify();
            gameMock.verify();
        });

        it('should use created client api and create new game when second game is started', () => {
            var clientApiInstance = {clientApiInstance: 'instance'};
            clientApiMock.expects('create').withArgs(clients).returns(clientApiInstance).never();
            gameMock.expects('create').withArgs(session.players, session.maxPoints, session.players[1], clientApiInstance).once();

            session.startGame();

            clientApiMock.verify();
            gameMock.verify();
        });
    });
});