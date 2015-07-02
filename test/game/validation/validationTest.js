"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../server/game/deck/card');
let Validation  = require('../../../server/game/validation/validation');
let GameMode = require('../../../server/game/gameMode');

//let player      = require('../../../lib/game/player/player').create();
//let sinon       = require('sinon');

describe('Validation', function () {
    //let playerMock;

    beforeEach(function () {
        //playerMock = sinon.mock(player);
    });

    it('should validate "angeben" without Trumpf', () => {
        let cardOne = Card.create(10, Card.CardColor.SPADES);
        let handCardOne = Card.create(11, Card.CardColor.SPADES);
        let handCardTwo = Card.create(11, Card.CardColor.HEARTS);
        let tableCards = [cardOne];
        let handCards = [handCardOne, handCardTwo];
        let validation = Validation.create(GameMode.TRUMPF, Card.CardColor.CLUBS);
        assert(validation.validate(tableCards, handCards, handCardOne));
    });
});

