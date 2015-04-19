"use strict";

let assert = require('assert'); // node.js core module
let Deck = require('../../../lib/game/deck/deck');
let CardType = require('../../../lib/game/deck/card').CardType;

describe('Deck', function() {

    it('has no cards on creation', function() {
        let deck = Object.create(Deck);

        assert(deck.cards === undefined);
    });

    it('gets instance specific shuffled deck on shuffleCards()', function() {
        let deck = Object.create(Deck),
            deck2 = Object.create(Deck);

        deck.shuffleCards();
        deck2.shuffleCards();

        assert(deck.cards !== deck2.cards, 'Cards array is not the same in prototype');
    });

});