import assert from 'assert';
import * as Deck from '../../../../server/game/deck/deck';

describe('Deck', function() {

    it('has shuffled cards', () => {
        let deck = Deck.create(),
            deck2 = Deck.create(),
            foundNotIdenticalCard;

        assert(deck.cards !== deck2.cards, 'Cards array are the same in two instances');
        assert(deck.cards.length === 36, 'There are 36 cards in the array');
        for(let i = 0; i < deck.cards.length; i++) {
            let card = deck.cards[i],
                card2 = deck2.cards[i];

            if (card.number !== card2.number || card.color !== card2.color) {
                foundNotIdenticalCard = true;
            }
        }
        assert(foundNotIdenticalCard, 'cards in deck not shuffled. Two deck instances have same ordered cards');
    });
});