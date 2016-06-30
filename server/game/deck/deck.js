

import _ from 'lodash';
import {CardColor} from './../../../shared/deck/cardColor';
import * as Card from './../../../shared/deck/card';

const cards = Array.from(new Array(36), (x, i) => i).map((element, index) => {
    let cardStep = Math.floor(index / 4) + 6;
    let cardColor = Object.keys(CardColor)[index % 4];

    return Card.create(cardStep, CardColor[cardColor]);
});

const Deck = {
    deal: function deal(player, count) {
        player.dealCards(this.cards.splice(0, count));
    }
};

export function create() {
    let deck = Object.create(Deck);
    deck.cards = _.shuffle(cards);
    return deck;
}