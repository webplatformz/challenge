'use strict';

let GameMode = require('../gameMode');
let CardType = require('../deck/card').CardType;
let Card = require('../deck/card');

let CycleCounter = {
    count: function count(mode, gameTrumpf, cardSet) {
        return cardSet[2];
    }

};

module.exports = CycleCounter;