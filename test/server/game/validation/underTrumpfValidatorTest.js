"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../../shared/deck/card');
let CardColor   = require('../../../../shared/deck/cardColor');
let UnderTrumpfValidator = require('../../../../server/game/validation/underTrumpfValidator');
let GameMode = require('../../../../shared/game/gameMode');


describe('UnderTrumpf Validator', function () {


    it('should allow any card, if no cards have been played', () => {
        let parameters = {
            color: CardColor.CLUBS,
            mode: GameMode.TRUMPF,
            tableCards: [],
            handCards: [Card.create(6, CardColor.HEARTS), Card.create(10, CardColor.DIAMONDS)],
            cardToPlay: Card.create(6, CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should allow higher Trumpf', () => {
        let parameters = {
            color: CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, CardColor.DIAMONDS), Card.create(6, CardColor.HEARTS)],
            handCards: [Card.create(10, CardColor.HEARTS), Card.create(10, CardColor.DIAMONDS)],
            cardToPlay: Card.create(10, CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should deny lower Trumpf when having other cards matching', () => {
        let parameters = {
            color: CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, CardColor.DIAMONDS), Card.create(10, CardColor.HEARTS)],
            handCards: [Card.create(6, CardColor.HEARTS), Card.create(10, CardColor.DIAMONDS)],
            cardToPlay: Card.create(6, CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(!validationResult.permitted);
    });

    it('should deny lower Trumpf when having other cards not Trumpf', () => {
        let parameters = {
            color: CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, CardColor.DIAMONDS), Card.create(10, CardColor.HEARTS)],
            handCards: [Card.create(6, CardColor.HEARTS), Card.create(10, CardColor.SPADES)],
            cardToPlay: Card.create(6, CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(!validationResult.permitted);
    });

    it('should allow lower Trumpf when having Trumpf only', () => {
        let parameters = {
            color: CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, CardColor.DIAMONDS), Card.create(12, CardColor.HEARTS)],
            handCards: [Card.create(6, CardColor.HEARTS), Card.create(14, CardColor.HEARTS)],
            cardToPlay: Card.create(6, CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should allow to play trumpf, if trumpf is the color', () => {
        let parameters = {
            color: CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(11, CardColor.HEARTS)],
            handCards: [Card.create(2, CardColor.HEARTS), Card.create(14, CardColor.SPADES)],
            cardToPlay: Card.create(2, CardColor.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });
});

