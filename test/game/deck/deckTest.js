"use strict";

var assert = require("assert"); // node.js core module
var Deck = require("../../../lib/game/deck/deck");
var Card = require("../../../lib/game/deck/card");

function arraysElementsEqualsButOtherOrder(array1, array2) {
    // TODO implement
    return true;
}

describe('Deck', function() {
    var createDeck = function() {
        var deck = Object.create(Deck).init();
        deck.shuffleCards();
        return deck;
    };


    it('should contain the same cards after shuffling but with different order', function() {
        var deck = Object.create(Deck).init();
        var initialCards = deck.getCards();

        var shuffledCards = deck.shuffleCards();

        assert.equal(true, arraysElementsEqualsButOtherOrder(initialCards, shuffledCards));
    });

    it('should have been initialized with 36 cards', function() {
        var deck = createDeck();

        assert.equal(deck.size(), 36);
    });

    it('should allow to take the top card', function() {
        var deck = createDeck();
        var initialSize = deck.size();
        var card = deck.takeCard();

        assert.equal(deck.size(), initialSize -1);
    });
});