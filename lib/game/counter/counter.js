'use strict';

let GameMode = require('../../../lib/game/game').GameMode;


let nonTrumpCardValues = {
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 10,
    11: 2,
    12: 3,
    13: 4,
    14: 11
};

let trumpCardValues = {
    6: 0,
    7: 0,
    8: 0,
    9: 14,
    10: 10,
    11: 20,
    12: 3,
    13: 4,
    14: 11
};

let obenabeCardValues = {
    6: 0,
    7: 0,
    8: 8,
    9: 0,
    10: 10,
    11: 2,
    12: 3,
    13: 4,
    14: 11
};

let untenraufCardValues = {
    6: 11,
    7: 0,
    8: 8,
    9: 0,
    10: 10,
    11: 2,
    12: 3,
    13: 4,
    14: 0
};

let Counter = {
    count: function count(mode, gameTrumpf, cardSet) {
        let result = 0;

        cardSet.forEach(card => {
            if(mode === GameMode.OBENABEN) {
                result += obenabeCardValues[card.number];
            } else if(mode === GameMode.UNTENRAUF) {
                result += untenraufCardValues[card.number];
            } else if (gameTrumpf === card.type) {
                result += trumpCardValues[card.number];
            } else {
                result += nonTrumpCardValues[card.number];
            }
        });

        return result;
    }

};

module.exports = Counter;