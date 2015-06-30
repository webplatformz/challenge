"use strict";

let assert = require("assert");
let GameMode = require('../../../lib/game/gameMode');
let CycleCounter = require('../../../lib/game/cycle/cycleCounter');
let CardType = require('../../../lib/game/deck/card').CardType;
let Card = require('../../../lib/game/deck/card');


describe('CycleCounter', function() {
    it('should count simple array without Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardType = CardType.SPADES;

        let winnerCard = Card.create(14, CardType.DIAMONDS);

        let cardSet = [
            Card.create(6, CardType.DIAMONDS),
            Card.create(12, CardType.DIAMONDS),
            winnerCard,
            Card.create(10, CardType.DIAMONDS)];

        let result = CycleCounter.count(mode, cardType, cardSet);
        assert.equal(winnerCard, result);
    });
});