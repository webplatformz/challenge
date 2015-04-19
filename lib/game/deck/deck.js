'use strict';

let _ = require('underscore');
let Card = require('./card');

let cards = _.map(_.range(36), function(element, index) {
    let cardStep = Math.floor(index / 4) + 6;
    let cardType = Object.keys(Card.CardType)[index % 4];

    return Card.create(cardStep, Card.CardType[cardType]);
});

let Deck = {

    shuffleCards: function shuffleCards() {
        this.cards = _.shuffle(cards);
    },

    takeCard: function takeCard() {
        return this.cards.pop();
    }

};

module.exports = Deck;