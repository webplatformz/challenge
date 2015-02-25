"use strict";

var assert = require("assert"); // node.js core module
var mockery = require('mockery');
var Card = require('../../lib/game/deck/card');
var sinon = require('sinon');

var deckMock = {
    getShuffledCards : function() {
        var deck = [];
        for (var i = 0; i < 36; i++) {
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
    var game;
    beforeEach(function(){
        game = Object.create(require('../../lib/game/game'));
        sinon.spy(deckMock, 'getShuffledCards');
    });

    afterEach(function() {
       deckMock.getShuffledCards.restore();
    });


    it('should deal the cards properly', function() {
        game.init();
        assert(deckMock.getShuffledCards.called);
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