'use strict';

let Card = {
    equals: function (otherCard) {
        return this.number === otherCard.number && this.color === otherCard.color;
    }
};

export function create(number, color) {
    let card = Object.create(Card);
    card.number = number;
    card.color = color;
    return card;
}