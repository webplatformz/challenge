'use strict';

let Session = require('../../lib/game/session');
let expect = require('chai').expect;

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
        it('should create clientApi with webSockets array', () => {

        });

        it('should fail if session is not complete', () => {
             //expect(session.startGame()).to.throw('Not enough players to start game!');
        });


    });


});