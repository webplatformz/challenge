"use strict";

var assert = require('assert'); // node.js core module
var Deck = require('../../../lib/game/deck/deck');
var CardType = require('../../../lib/game/deck/card').CardType;

describe('Deck', function() {

    it('has shared, ordered initial set of cards', function() {
        var deck = Object.create(Deck);
        var deck2 = Object.create(Deck);

        var firstCard = deck.takeCard();
        assert(firstCard.number === 14);
        assert(firstCard.type === CardType.SPADES);

        var secondCard = deck2.takeCard();
        assert(secondCard.number === 14);
        assert(secondCard.type === CardType.CLUBS);

        assert(deck.cards === deck2.cards, 'Cards arrays of the objects are the same');
    });

    it('gets instance specific shuffled deck on shuffleCards()', function() {
        var deck = Object.create(Deck);
        deck.shuffleCards();

        assert(Deck.cards !== deck.cards, 'Cards array is not the same in prototype');
    });

});