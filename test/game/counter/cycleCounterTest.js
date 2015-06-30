"use strict";

let assert = require("assert");
let GameMode = require('../../../lib/game/gameMode');
let CycleCounter = require('../../../lib/game/cycle/cycleCounter');
let CardColor = require('../../../lib/game/deck/card').CardColor;
let Card = require('../../../lib/game/deck/card');


describe('CycleCounter', function() {
    it('should count simple array without Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardColor = CardColor.SPADES;

        let winnerCard = Card.create(14, CardColor.DIAMONDS);

        let cardSet = [
            Card.create(6, CardColor.DIAMONDS),
            Card.create(12, CardColor.DIAMONDS),
            winnerCard,
            Card.create(10, CardColor.DIAMONDS)];

        let result = CycleCounter.count(mode, cardColor, cardSet);
        assert.equal(winnerCard, result);
    });
});