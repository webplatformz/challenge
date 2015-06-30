"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../lib/game/deck/card');
let AngebenValidator  = require('../../../lib/game/validation/angebenValidator');
let GameMode = require('../../../lib/game/game').GameMode;


describe('Angeben Validator', function () {


    it('should allow any card, if no cards have been played', () => {
        let parameters = {
            color: Card.CardType.CLUBS,
            mode: GameMode.TRUMPF,
            tableCards: [],
            handCards: [Card.create(6, Card.CardType.HEARTS), Card.create(10, Card.CardType.DIAMONDS)],
            cardToPlay: Card.create(6, Card.CardType.HEARTS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should allow any Trumpf', () => {
        let parameters = {
            color: Card.CardType.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardType.DIAMONDS)],
            handCards: [Card.create(10, Card.CardType.HEARTS), Card.create(10, Card.CardType.DIAMONDS)],
            cardToPlay: Card.create(10, Card.CardType.HEARTS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should NOT allow any color, if a player still has a card of the correct color', () => {
        let parameters = {
            color: Card.CardType.SPADES,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardType.DIAMONDS)],
            handCards: [Card.create(10, Card.CardType.HEARTS), Card.create(10, Card.CardType.DIAMONDS)],
            cardToPlay: Card.create(10, Card.CardType.HEARTS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(!validationResult.permitted);
    });

    it('should allow the same color', () => {
        let parameters = {
            color: Card.CardType.SPADES,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardType.DIAMONDS)],
            handCards: [Card.create(10, Card.CardType.HEARTS), Card.create(10, Card.CardType.DIAMONDS)],
            cardToPlay: Card.create(10, Card.CardType.DIAMONDS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });
});

