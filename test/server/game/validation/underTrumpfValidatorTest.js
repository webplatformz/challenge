"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../../server/game/deck/card');
let UnderTrumpfValidator = require('../../../../server/game/validation/underTrumpfValidator');
let GameMode = require('../../../../server/game/gameMode');


describe('UnderTrumpf Validator', function () {


    it('should allow any card, if no cards have been played', () => {
        let parameters = {
            color: Card.CardColor.CLUBS,
            mode: GameMode.TRUMPF,
            tableCards: [],
            handCards: [Card.create(6, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(6, Card.CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should allow higher Trumpf', () => {
        let parameters = {
            color: Card.CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS), Card.create(6, Card.CardColor.HEARTS)],
            handCards: [Card.create(10, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(10, Card.CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should deny lower Trumpf when having other cards matching', () => {
        let parameters = {
            color: Card.CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS), Card.create(10, Card.CardColor.HEARTS)],
            handCards: [Card.create(6, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(6, Card.CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(!validationResult.permitted);
    });

    it('should deny lower Trumpf when having other cards not Trumpf', () => {
        let parameters = {
            color: Card.CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS), Card.create(10, Card.CardColor.HEARTS)],
            handCards: [Card.create(6, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.SPADES)],
            cardToPlay: Card.create(6, Card.CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(!validationResult.permitted);
    });
    it('should allow lower Trumpf when having Trumpf only', () => {
        let parameters = {
            color: Card.CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS), Card.create(12, Card.CardColor.HEARTS)],
            handCards: [Card.create(6, Card.CardColor.HEARTS), Card.create(14, Card.CardColor.HEARTS)],
            cardToPlay: Card.create(6, Card.CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });
});

