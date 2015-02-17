"use strict";

var assert = require("assert"); // node.js core module
var mockery = require('mockery');
var Card = require('../../lib/game/deck/card');

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
    mockery.enable();
    mockery.registerMock('./deck/deck', deckMock);
    var game = Object.create(require('../../lib/game/game'));


    it('should deal the cards properly', function() {
        game.init();

    });
});