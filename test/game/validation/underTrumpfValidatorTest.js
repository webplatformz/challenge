"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../lib/game/deck/card');
let UnderTrumpfValidator = require('../../../lib/game/validation/underTrumpfValidator');
let GameMode = require('../../../lib/game/game').GameMode;


describe('UnderTrumpf Validator', function () {


    it('should allow any card, if no cards have been played', () => {
        let parameters = {
            color: Card.CardType.CLUBS,
            mode: GameMode.TRUMPF,
            tableCards: [],
            handCards: [Card.create(6, Card.CardType.HEARTS), Card.create(10, Card.CardType.DIAMONDS)],
            cardToPlay: Card.create(6, Card.CardType.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should allow higher Trumpf', () => {
        let parameters = {
            color: Card.CardType.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardType.DIAMONDS), Card.create(6, Card.CardType.HEARTS)],
            handCards: [Card.create(10, Card.CardType.HEARTS), Card.create(10, Card.CardType.DIAMONDS)],
            cardToPlay: Card.create(10, Card.CardType.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should deny lower Trumpf when having other cards mathing', () => {
        let parameters = {
            color: Card.CardType.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardType.DIAMONDS), Card.create(10, Card.CardType.HEARTS)],
            handCards: [Card.create(6, Card.CardType.HEARTS), Card.create(10, Card.CardType.DIAMONDS)],
            cardToPlay: Card.create(6, Card.CardType.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(!validationResult.permitted);
    });

    it('should deny lower Trumpf when having other cards not Trumpf', () => {
        let parameters = {
            color: Card.CardType.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardType.DIAMONDS), Card.create(10, Card.CardType.HEARTS)],
            handCards: [Card.create(6, Card.CardType.HEARTS), Card.create(10, Card.CardType.SPADES)],
            cardToPlay: Card.create(6, Card.CardType.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(!validationResult.permitted);
    });
    it('should allow lower Trumpf when having Trumpf only', () => {
        let parameters = {
            color: Card.CardType.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardType.DIAMONDS), Card.create(12, Card.CardType.HEARTS)],
            handCards: [Card.create(6, Card.CardType.HEARTS), Card.create(11, Card.CardType.HEARTS)],
            cardToPlay: Card.create(6, Card.CardType.HEARTS)
        };

        let validationResult = UnderTrumpfValidator.validate(parameters);

        assert(validationResult.permitted);
    });
});

