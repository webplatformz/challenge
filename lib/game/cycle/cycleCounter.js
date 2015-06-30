'use strict';

let GameMode = require('../../../lib/game/game').GameMode;
let CardType = require('../../../lib/game/deck/card').CardType;
let Card = require('../../../lib/game/deck/card');

let CycleCounter = {
    count: function count(mode, gameTrumpf, cardSet) {
        return cardSet[2];
    }

};

module.exports = CycleCounter;