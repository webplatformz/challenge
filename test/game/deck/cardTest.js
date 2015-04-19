"use strict";

let assert = require('assert');
let Card = require('../../../lib/game/deck/card');

describe('Card', function() {
    it('should be possible to create cards', function() {
        let card = Card.create(6, Card.CardType.DIAMONDS);
        assert(card.number === 6, 'Card has given number');
        assert(card.type === Card.CardType.DIAMONDS, 'Card has given type');
    });

    it('should prevent modifications on CardType', function() {
        assert.throws(function() {
            Card.CardType.DIAMONDS = 'test';
        }, 'Type Error');
    });

});