"use strict";

import assert from 'assert';
import {GameMode} from '../../../../shared/game/gameMode';
import * as Counter from '../../../../server/game/counter/counter';
import {CardColor} from '../../../../shared/deck/cardColor';
import * as Card from '../../../../shared/deck/card';


describe('Counter', function() {
    it('should count simple array without Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardColor = CardColor.SPADES;

        let cardSet = [
            Card.create(6, CardColor.DIAMONDS),
            Card.create(12, CardColor.DIAMONDS),
            Card.create(14, CardColor.DIAMONDS),
            Card.create(10, CardColor.DIAMONDS),
            Card.create(11, CardColor.HEARTS)];

        let value = Counter.count(mode, cardColor, cardSet);
        assert.equal(52, value);
    });

    it('should count simple array with double multiplicated Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardColor = CardColor.SPADES;

        let cardSet = [
            Card.create(6, CardColor.DIAMONDS),
            Card.create(12, CardColor.DIAMONDS),
            Card.create(14, CardColor.DIAMONDS),
            Card.create(9, CardColor.SPADES),
            Card.create(11, CardColor.SPADES)];

        let value = Counter.count(mode, cardColor, cardSet);
        assert.equal(96, value);
    });

    it('should count simple array with single multiplicated Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardColor = CardColor.DIAMONDS;

        let cardSet = [
            Card.create(6, CardColor.DIAMONDS),
            Card.create(12, CardColor.DIAMONDS),
            Card.create(14, CardColor.DIAMONDS),
            Card.create(9, CardColor.DIAMONDS),
            Card.create(11, CardColor.DIAMONDS)];

        let value = Counter.count(mode, cardColor, cardSet);
        assert.equal(48, value, 'Cardset value matches');
    });

    it('should count simple array with obenaben', function() {
        let mode = GameMode.OBEABE;

        let cardSet = [
            Card.create(8, CardColor.DIAMONDS),
            Card.create(12, CardColor.DIAMONDS),
            Card.create(14, CardColor.DIAMONDS),
            Card.create(9, CardColor.SPADES),
            Card.create(11, CardColor.SPADES)];

        let value = Counter.count(mode, null, cardSet);
        assert.equal(72, value, 'Cardset value matches');
    });

    it('should count simple array with untenrauf', function() {
        let mode = GameMode.UNDEUFE;

        let cardSet = [
            Card.create(8, CardColor.DIAMONDS),
            Card.create(6, CardColor.DIAMONDS),
            Card.create(14, CardColor.DIAMONDS),
            Card.create(9, CardColor.SPADES),
            Card.create(11, CardColor.SPADES)];

        let value = Counter.count(mode, null, cardSet);
        assert.equal(63, value, 'Cardset value matches');
    });
});