"use strict";

let CardColor = {
    HEARTS: "hearts",
    DIAMONDS: "diamonds",
    CLUBS: "clubs",
    SPADES: "spades"
};

Object.freeze(CardColor);

module.exports = {
    CardColor: CardColor,

    create: function(number, color) {
        return {
            number: number,
            color: color,
            isBuur : () => {
                return number === 11;
            },
            isNell : () => {
                return number === 9;
            }
        };
    }
};