"use strict";

import assert from 'assert';
import Card from '../../../shared/deck/card';
import CardColor from '../../../shared/deck/cardColor';
import GameMode from '../../../shared/game/gameMode';

describe('Card', function() {
    it('should create cards', function() {
        let card = Card.create(6, CardColor.DIAMONDS);
        assert(card.number === 6, 'Card has given number');
        assert(card.color === CardColor.DIAMONDS, 'Card has given color');
    });
});