"use strict";

var CardType = {
    HEARTS: "hearts",
    DIAMONDS: "diamonds",
    CLUBS: "clubs",
    SPADES: "spades"
};

if (Object.freeze) {
    Object.freeze(CardType);
}
function Card(number, type) {
    this.number = number;
    this.type = type;
}

module.exports = {
    CardType: CardType,
    Card: Card
};