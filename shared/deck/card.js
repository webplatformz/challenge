"use strict";

const CardColor = {
    HEARTS: "hearts",
    DIAMONDS: "diamonds",
    CLUBS: "clubs",
    SPADES: "spades"
};

Object.freeze(CardColor);

let Card = {
    equals: function(otherCard) {
        return this.number === otherCard.number && this.color === otherCard.color;
    }
};

let create = function create(number, color) {
    let card = Object.create(Card);
    card.number = number;
    card.color = color;
    return card;
};

module.exports = {
    CardColor: CardColor,
    create
};