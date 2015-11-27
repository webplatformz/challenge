'use strict';

const CardColor = {
    HEARTS: 'HEARTS',
    DIAMONDS: 'DIAMONDS',
    CLUBS: 'CLUBS',
    SPADES: 'SPADES'
};

let Card = {
    equals: function(otherCard) {
        return this.number === otherCard.number && this.color === otherCard.color;
    }
};

export default {
    CardColor: CardColor,
    create(number, color) {
        let card = Object.create(Card);
        card.number = number;
        card.color = color;
        return card;
    }
};