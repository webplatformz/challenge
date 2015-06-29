"use strict";

let assert = require('assert'); // node.js core module
let Deck = require('../../../lib/game/deck/deck');
let CardType = require('../../../lib/game/deck/card').CardType;

describe('Deck', function() {

    it('has shuffled cards', () => {
        let deck = Deck.create(),
            deck2 = Deck.create(),
            foundNotIdenticalCard;

        assert(deck.cards !== deck2.cards, 'Cards array are the same in two instances');
        for(let i = 0; i < deck.cards.length; i++) {
            let card = deck.cards[i],
                card2 = deck2.cards[i];

            if (card.number !== card2.number || card.type !== card2.type) {
                foundNotIdenticalCard = true;
            }
        }
        assert(foundNotIdenticalCard, 'cards in deck not shuffled. Two deck instances have same ordered cards');
    });
});