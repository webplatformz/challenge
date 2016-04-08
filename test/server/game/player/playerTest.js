"use strict";

import {expect} from 'chai';
import Player from '../../../../server/game/player/player';
import Card from '../../../../shared/deck/card';
import {CardColor} from '../../../../shared/deck/cardColor';

describe('Player', function() {

    it('should remove the correct card', () => {
        let player = Player.create();
        player.cards = [Card.create(2, CardColor.CLUBS), Card.create(10, CardColor.CLUBS)];

        player.removeCard(Card.create(2, CardColor.CLUBS));

        expect(player.cards.length).to.equal(1);
        expect(Card.create(10, CardColor.CLUBS)).to.eql(player.cards[0]);
    });
});