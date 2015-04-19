"use strict";

let CardType = {
    HEARTS: "hearts",
    DIAMONDS: "diamonds",
    CLUBS: "clubs",
    SPADES: "spades"
};

Object.freeze(CardType);

module.exports = {
    CardType: CardType,

    create: function(number, type) {
        return {
            number: number,
            type: type
        };
    }
};