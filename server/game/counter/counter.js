'use strict';

let GameMode = require('../gameMode');
let CardColor = require('../../../shared/deck/card').CardColor;


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


let calculateMultiplicator = function calculateMultiplicator(mode, gameTrumpf) {
    if(mode === GameMode.OBEABE || mode === GameMode.UNDEUFE) {
        return 3;
    } else if(gameTrumpf === CardColor.DIAMONDS || gameTrumpf === CardColor.HEARTS) {
        return 1;
    } else {
        return 2;
    }
};

let Counter = {
    count: function count(mode, cardColor, cardSet) {
        let result = 0;

        cardSet.forEach(card => {
            if(mode === GameMode.OBEABE) {
                result += obenabeCardValues[card.number];
            } else if(mode === GameMode.UNDEUFE) {
                result += untenraufCardValues[card.number];
            } else if (cardColor === card.color) {
                result += trumpCardValues[card.number];
            } else {
                result += nonTrumpCardValues[card.number];
            }
        });

        result = calculateMultiplicator(mode, cardColor) * result;
        return result;
    },

    calculateMatchValues(mode, cardColor) {
        return calculateMultiplicator(mode, cardColor) * 100;
    },

    calculateLastStichValue(mode, cardColor) {
        return calculateMultiplicator(mode, cardColor) * 5;

    }

};

module.exports = Counter;