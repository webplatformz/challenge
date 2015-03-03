'use strict';

var _ = require('underscore');
var Card = require('./card');

var Deck = {
    cards: _.map(_.range(36), function(element, index) {
        var cardStep = Math.floor(index / 4) + 6;
        var cardType = Object.keys(Card.CardType)[index % 4];

        return Card.create(cardStep, Card.CardType[cardType]);
    }),

    shuffleCards: function shuffleCards() {
        this.cards = _.shuffle(this.cards);
    },

    takeCard: function takeCard() {
        return this.cards.pop();
    }

};

module.exports = Deck;
