"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../lib/game/deck/card');
let Validation  = require('../../../lib/game/validation/validation');
let GameMode = require('../../../lib/game/gameMode');

//let player      = require('../../../lib/game/player/player').create();
//let sinon       = require('sinon');

describe('Validation', function () {
    //let playerMock;

    beforeEach(function () {
        //playerMock = sinon.mock(player);
    });

    it('should validate "angeben" without Trumpf', () => {
        let cardOne = Card.create(10, Card.CardType.SPADES);
        let handCardOne = Card.create(11, Card.CardType.SPADES);
        let handCardTwo = Card.create(11, Card.CardType.HEARTS);
        let tableCards = [cardOne];
        let handCards = [handCardOne, handCardTwo];
        let validation = Validation.create(GameMode.TRUMPF, Card.CardType.CLUBS);
        assert(validation.validate(tableCards, handCards, handCardOne));
    });
});

