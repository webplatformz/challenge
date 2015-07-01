'use strict';

let GameMode = require('../gameMode');
let CardType = require('../deck/card').CardType;
let Card = require('../deck/card');

let StichGranter = {
    count: function count(mode, cardColor, cardSet) {
        return cardSet[2];
    }

};

module.exports = StichGranter;