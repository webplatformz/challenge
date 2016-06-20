'use strict';

import assert from 'assert';
import * as Card from '../../../../shared/deck/card';
import {CardColor} from '../../../../shared/deck/cardColor';
import Validation from '../../../../server/game/validation/validation';
import {GameMode} from '../../../../shared/game/gameMode';

describe('Validation', function () {

    it('should validate "angeben" without Trumpf', () => {
        let cardOne = Card.create(10, CardColor.SPADES);
        let handCardOne = Card.create(11, CardColor.SPADES);
        let handCardTwo = Card.create(11, CardColor.HEARTS);
        let tableCards = [cardOne];
        let handCards = [handCardOne, handCardTwo];
        let validation = Validation.create(GameMode.TRUMPF, CardColor.CLUBS);
        assert(validation.validate(tableCards, handCards, handCardOne));
    });
    it('should validate "angeben" without obenabä', () => {
        let cardOne = Card.create(10, CardColor.SPADES);
        let handCardOne = Card.create(11, CardColor.SPADES);
        let handCardTwo = Card.create(11, CardColor.HEARTS);
        let tableCards = [cardOne];
        let handCards = [handCardOne, handCardTwo];
        let validation = Validation.create(GameMode.OBEABE);
        assert(validation.validate(tableCards, handCards, handCardOne));
    });
});

