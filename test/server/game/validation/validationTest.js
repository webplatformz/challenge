"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../../shared/deck/card');
let CardColor   = require('../../../../shared/deck/cardColor');
let Validation  = require('../../../../server/game/validation/validation');
let GameMode = require('../../../../shared/game/gameMode');

//let player      = require('../../../server/game/player/player').create();
//let sinon       = require('sinon');

describe('Validation', function () {
    //let playerMock;

    beforeEach(function () {
        //playerMock = sinon.mock(player);
    });

    it('should validate "angeben" without Trumpf', () => {
        let cardOne = Card.create(10, CardColor.SPADES);
        let handCardOne = Card.create(11, CardColor.SPADES);
        let handCardTwo = Card.create(11, CardColor.HEARTS);
        let tableCards = [cardOne];
        let handCards = [handCardOne, handCardTwo];
        let validation = Validation.create(GameMode.TRUMPF, CardColor.CLUBS);
        assert(validation.validate(tableCards, handCards, handCardOne));
    });
    it('should validate "angeben" without obenabä', () => {
        let cardOne = Card.create(10, CardColor.SPADES);
        let handCardOne = Card.create(11, CardColor.SPADES);
        let handCardTwo = Card.create(11, CardColor.HEARTS);
        let tableCards = [cardOne];
        let handCards = [handCardOne, handCardTwo];
        let validation = Validation.create(GameMode.OBEABE);
        assert(validation.validate(tableCards, handCards, handCardOne));
    });
});

