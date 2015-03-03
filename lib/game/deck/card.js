"use strict";

var CardType = {
    HEARTS: "hearts",
    DIAMONDS: "diamonds",
    CLUBS: "clubs",
    SPADES: "spades"
};

module.exports = {
    CardType: CardType,

    create: function(number, type) {
        return {
            number: number,
            type: type
        };
    }
};