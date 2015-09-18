'use strict';

let _ = require('lodash');
let Card = require('./../../../shared/deck/card');

let cards = _.map(_.range(36), function(element, index) {
    let cardStep = Math.floor(index / 4) + 6;
    let cardColor = Object.keys(Card.CardColor)[index % 4];

    return Card.create(cardStep, Card.CardColor[cardColor]);
});

let Deck = {
    deal: function deal(player, count) {
        player.dealCards(this.cards.splice(0, count));
    }
};

let create = function create() {
    let deck = Object.create(Deck);
    deck.cards = _.shuffle(cards);
    return deck;
};

module.exports = {
    create
};