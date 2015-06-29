"use strict";

let assert = require("assert"); // node.js core module
let mockery = require('mockery');
let Card = require('../../lib/game/deck/card');
let sinon = require('sinon');
let Game = require('../../lib/game/game');

let deckMock = {
    shuffleCards : function() {
        let deck = [];
        for (let i = 0; i < 36; i++) {
            deck.push(new Card.Card(8, Card.CardType.DIAMONDS));
        }
        return deck;
    }
};

describe('Game', function() {
    mockery.enable({
        warnOnUnregistered: false
    });
    mockery.registerMock('./deck/deck', deckMock);
    let game;
    beforeEach(function(){
        game = Object.create(Game);
        sinon.spy(deckMock, 'shuffleCards');
    });

    afterEach(function() {
       deckMock.shuffleCards.restore();
    });


    it('should deal the cards properly', function() {
        game.init();
        //assert(deckMock.shuffleCards.called);
    });

    it('should send a command to requestTrump', function() {
        game.init();
        game.chooseTrump();
        // assert that request trump command has been send
    });

    it('should send a command to requestTrump to the next player after the first player pushed', function() {
        game.init();
        game.chooseTrump();
        game.pushTrumpChoice();
        // assert that push command has been send
    });
});