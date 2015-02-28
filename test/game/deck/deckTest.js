"use strict";

var assert = require("assert"); // node.js core module
var Deck = require("../../../lib/game/deck/deck");
var Card = require("../../../lib/game/deck/card");



describe('Deck', function() {
    var createDeck = function() {
        var deck = Object.create(Deck);
        deck.clear();
        var cardNumber;
        for(cardNumber = 6; cardNumber < 11; cardNumber++) {
            deck.addCard(new Card.Card(cardNumber, Card.CardType.HEARTS));
        }
        for(cardNumber = 6; cardNumber < 11; cardNumber++) {
            deck.addCard(new Card.Card(cardNumber, Card.CardType.SPADES));
        }
        for(cardNumber = 6; cardNumber < 11; cardNumber++) {
            deck.addCard(new Card.Card(cardNumber, Card.CardType.CLUBS));
        }

        return deck;
    };


    //it('should contain the same cards after shuffling', function() {
    //
    //});
    //
    //it('should have a different order after shuffling', function() {
    //
    //});

    it('should allow to add cards', function() {
        var deck = createDeck();
        var numberOfCards = deck.size();

        deck.addCard(new Card.Card(12, Card.CardType.SPADES));

        assert.equal(deck.size(), numberOfCards + 1);
    });

    it('should allow to take the top card', function() {
        var deck = createDeck();
        assert.equal(deck.size(), 15);
        var card = deck.takeCard();

        assert.equal(deck.size(), 14);
    });
});