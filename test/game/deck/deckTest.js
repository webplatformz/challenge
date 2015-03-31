"use strict";

var assert = require('assert'); // node.js core module
var Deck = require('../../../lib/game/deck/deck');
var CardType = require('../../../lib/game/deck/card').CardType;

describe('Deck', function() {

    it('has no cards on creation', function() {
        var deck = Object.create(Deck);

        assert(deck.cards === undefined);
    });

    it('gets instance specific shuffled deck on shuffleCards()', function() {
        var deck = Object.create(Deck),
            deck2 = Object.create(Deck);

        deck.shuffleCards();
        deck2.shuffleCards();

        assert(deck.cards !== deck2.cards, 'Cards array is not the same in prototype');
    });

});