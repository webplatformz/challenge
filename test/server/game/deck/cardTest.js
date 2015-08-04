"use strict";

let assert = require('assert');
let Card = require('../../../../shared/deck/card');
let CardColor = require('../../../../shared/deck/card').CardColor;
let GameMode = require('../../../../shared/game/gameMode');

describe('Card', function() {
    it('should be possible to create cards', function() {
        let card = Card.create(6, Card.CardColor.DIAMONDS);
        assert(card.number === 6, 'Card has given number');
        assert(card.color === Card.CardColor.DIAMONDS, 'Card has given color');
    });

    it('should prevent modifications on CardColor', () => {
        assert.throws(function() {
            Card.CardColor.DIAMONDS = 'test';
        }, 'Color Error');
    });

});