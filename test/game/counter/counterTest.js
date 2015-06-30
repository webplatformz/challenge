"use strict";

let assert = require("assert"); // node.js core module
let GameMode = require('../../../lib/game/gameMode');
let Counter = require('../../../lib/game/counter/counter');
let CardType = require('../../../lib/game/deck/card').CardType;
let Card = require('../../../lib/game/deck/card');


describe('Counter', function() {
    it('should count simple array without Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardType = CardType.SPADES;

        let cardSet = [
            Card.create(6, CardType.DIAMONDS),
            Card.create(12, CardType.DIAMONDS),
            Card.create(14, CardType.DIAMONDS),
            Card.create(10, CardType.DIAMONDS),
            Card.create(11, CardType.HEARTS)];

        let value = Counter.count(mode, cardType, cardSet);
        assert.equal(52, value);
    });

    it('should count simple array with double multiplicated Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardType = CardType.SPADES;

        let cardSet = [
            Card.create(6, CardType.DIAMONDS),
            Card.create(12, CardType.DIAMONDS),
            Card.create(14, CardType.DIAMONDS),
            Card.create(9, CardType.SPADES),
            Card.create(11, CardType.SPADES)];

        let value = Counter.count(mode, cardType, cardSet);
        assert.equal(96, value);
    });

    it('should count simple array with single multiplicated Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardType = CardType.DIAMONDS;

        let cardSet = [
            Card.create(6, CardType.DIAMONDS),
            Card.create(12, CardType.DIAMONDS),
            Card.create(14, CardType.DIAMONDS),
            Card.create(9, CardType.DIAMONDS),
            Card.create(11, CardType.DIAMONDS)];

        let value = Counter.count(mode, cardType, cardSet);
        assert.equal(48, value, 'Cardset value matches');
    });

    it('should count simple array with obenaben', function() {
        let mode = GameMode.OBENABEN;

        let cardSet = [
            Card.create(8, CardType.DIAMONDS),
            Card.create(12, CardType.DIAMONDS),
            Card.create(14, CardType.DIAMONDS),
            Card.create(9, CardType.SPADES),
            Card.create(11, CardType.SPADES)];

        let value = Counter.count(mode, null, cardSet);
        assert.equal(72, value, 'Cardset value matches');
    });

    it('should count simple array with untenrauf', function() {
        let mode = GameMode.UNTENRAUF;

        let cardSet = [
            Card.create(8, CardType.DIAMONDS),
            Card.create(6, CardType.DIAMONDS),
            Card.create(14, CardType.DIAMONDS),
            Card.create(9, CardType.SPADES),
            Card.create(11, CardType.SPADES)];

        let value = Counter.count(mode, null, cardSet);
        assert.equal(63, value, 'Cardset value matches');
    });
});