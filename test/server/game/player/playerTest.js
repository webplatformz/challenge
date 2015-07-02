"use strict";

let assert = require('assert'); // node.js core module
let expect = require('chai').expect;
let Player = require('../../../../server/game/player/player');
let Card = require('../../../../shared/deck/card');

describe('Player', function() {

    it('should remove the correct card', () => {
        let player = Player.create();
        player.cards = [Card.create(2, Card.CardColor.CLUBS), Card.create(10, Card.CardColor.CLUBS)];

        player.removeCard(Card.create(2, Card.CardColor.CLUBS));

        expect(player.cards.length).to.equal(1);
        assert(Card.create(10, Card.CardColor.CLUBS).equals(player.cards[0]));
    });
});