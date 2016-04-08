"use strict";

import {expect} from 'chai';
import Card from '../../../shared/deck/card';
import CardColor from '../../../shared/deck/cardColor';

describe('Card', () => {
    it('should create cards', () => {
        let card = Card.create(6, CardColor.DIAMONDS);
        expect(card.number).to.equal(6);
        expect(card.color).to.equal(CardColor.DIAMONDS);
    });

    describe('equals', () => {
        it('should equal on same object', () => {
            let card = Card.create(10, CardColor.HEARTS);
            expect(card.equals(card)).to.equal(true);
        });

        it('should equal on same number and color', () => {
            let card1 = Card.create(12, CardColor.DIAMONDS);
            let card2 = Card.create(12, CardColor.DIAMONDS);
            expect(card1.equals(card2)).to.equal(true);
        });

        it('should not equal on different number', () => {
            let card1 = Card.create(12, CardColor.DIAMONDS);
            let card2 = Card.create(6, CardColor.DIAMONDS);
            expect(card1.equals(card2)).to.equal(false);
        });

        it('should not equal on different color', () => {
            let card1 = Card.create(6, CardColor.DIAMONDS);
            let card2 = Card.create(6, CardColor.HEARTS);
            expect(card1.equals(card2)).to.equal(false);
        });
    });
});