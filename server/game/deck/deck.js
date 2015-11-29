'use strict';

import _ from 'lodash';
import CardColor from './../../../shared/deck/cardColor';
import Card from './../../../shared/deck/card';

let cards = _.map(_.range(36), function(element, index) {
    let cardStep = Math.floor(index / 4) + 6;
    let cardColor = Object.keys(CardColor)[index % 4];

    return Card.create(cardStep, CardColor[cardColor]);
});

let Deck = {
    deal: function deal(player, count) {
        player.dealCards(this.cards.splice(0, count));
    }
};

export default {
    create () {
        let deck = Object.create(Deck);
        deck.cards = _.shuffle(cards);
        return deck;
    }
};