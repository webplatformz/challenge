"use strict";

import assert from 'assert';
import Card from '../../../shared/deck/card';
import GameMode from '../../../shared/game/gameMode';

let CardColor = Card.CardColor;

describe('Card', function() {
    it('should create cards', function() {
        let card = Card.create(6, Card.CardColor.DIAMONDS);
        assert(card.number === 6, 'Card has given number');
        assert(card.color === Card.CardColor.DIAMONDS, 'Card has given color');
    });
});