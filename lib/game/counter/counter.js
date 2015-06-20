'use strict';

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

let Counter = {
    count: function count(mode, gameTrumpf, cardSet) {
        let result = 0;

        cardSet.forEach(card => {
            if (gameTrumpf === card.type) {
                result += 0;
            } else {
                result += nonTrumpCardValues[card.number];
            }
        });

        return result;
    }

};

module.exports = Counter;