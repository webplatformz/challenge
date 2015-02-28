"use strict";

var assert = require("assert"); // node.js core module
var Deck = require("../../../lib/game/deck/deck");
var Card = require("../../../lib/game/deck/card");
var _ = require('underscore');

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
        deck.takeCard();

        assert.equal(deck.size(), initialSize -1);
    });
});

function arraysElementsEqualsButOtherOrder(array1, array2) {
    var arraysEqual = arraysEqualIgnoreSorting(array1, array2);
    // TODO Implement check for shuffling
    var arraysShuffled = true;
    return arraysEqual && arraysShuffled;
}

function arraysEqualIgnoreSorting(array1, array2) {
    for(var i = 0; i < array1.length; i++) {
        var card = array1[i];
        var cardPresent = isCardPresentInArray(array2, card);
        if(!cardPresent) {
            return false;
        }
    }
    return true;
}

function isCardPresentInArray(array, cardToFind) {
    for(var j = 0; j <array.length; j++) {
        var card = array[j];
        if(cardEqual(card, cardToFind)) {
            return true;
        }
    }
    return false;
}

function cardEqual(card1, card2) {
    return card1.number === card2.number && card1.type === card2.type;
}