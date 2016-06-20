'use strict';

import {expect} from 'chai';
import * as Card from '../../../../shared/deck/card';
import {CardColor} from '../../../../shared/deck/cardColor';
import Validation from '../../../../shared/game/validation/validation';
import {GameMode} from '../../../../shared/game/gameMode';

describe('Validation', function () {

    it('should validate "angeben" without Trumpf', () => {
        let cardOne = Card.create(10, CardColor.SPADES);
        let handCardOne = Card.create(11, CardColor.SPADES);
        let handCardTwo = Card.create(11, CardColor.HEARTS);
        let tableCards = [cardOne];
        let handCards = [handCardOne, handCardTwo];
        let validation = Validation.create(GameMode.TRUMPF, CardColor.CLUBS);
        expect(validation.validate(tableCards, handCards, handCardOne)).to.equal(true);
    });

    it('should validate "angeben" without obenabä', () => {
        let cardOne = Card.create(10, CardColor.SPADES);
        let handCardOne = Card.create(11, CardColor.SPADES);
        let handCardTwo = Card.create(11, CardColor.HEARTS);
        let tableCards = [cardOne];
        let handCards = [handCardOne, handCardTwo];
        let validation = Validation.create(GameMode.OBEABE);
        expect(validation.validate(tableCards, handCards, handCardOne)).to.equal(true);
    });

    it('should return true when 4 cards are on table', () => {
        let cardOne = Card.create(10, CardColor.SPADES);
        let validation = Validation.create(GameMode.OBEABE);
        expect(validation.validate([cardOne,cardOne,cardOne,cardOne])).to.equal(true);
    });
});

