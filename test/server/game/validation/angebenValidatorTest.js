"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../../shared/deck/card');
let AngebenValidator  = require('../../../../server/game/validation/angebenValidator');
let GameMode = require('../../../../server/game/gameMode');


describe('Angeben Validator', function () {


    it('should allow any card, if no cards have been played', () => {
        let parameters = {
            color: Card.CardColor.CLUBS,
            mode: GameMode.TRUMPF,
            tableCards: [],
            handCards: [Card.create(6, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(6, Card.CardColor.HEARTS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should allow any Trumpf', () => {
        let parameters = {
            color: Card.CardColor.HEARTS,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS)],
            handCards: [Card.create(10, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(10, Card.CardColor.HEARTS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should NOT allow any color, if a player still has a card of the correct color', () => {
        let parameters = {
            color: Card.CardColor.SPADES,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS)],
            handCards: [Card.create(10, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(10, Card.CardColor.HEARTS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(!validationResult.permitted);
    });

    it('should allow the same color', () => {
        let parameters = {
            color: Card.CardColor.SPADES,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS)],
            handCards: [Card.create(10, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(10, Card.CardColor.DIAMONDS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should allow to hold the trumpf buur', () => {
        let parameters = {
            color: Card.CardColor.SPADES,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.SPADES)],
            handCards: [Card.create(11, Card.CardColor.SPADES), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(10, Card.CardColor.DIAMONDS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should not allow to "nicht angeben" trumpf when more than buur', () => {
        let parameters = {
            color: Card.CardColor.SPADES,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.SPADES)],
            handCards: [Card.create(11, Card.CardColor.SPADES), Card.create(10, Card.CardColor.DIAMONDS), Card.create(10, Card.CardColor.SPADES)],
            cardToPlay: Card.create(10, Card.CardColor.DIAMONDS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(!validationResult.permitted);
    });

    it('should allow another color, if no cards of the given color have been left', () => {
        let parameters = {
            color: Card.CardColor.SPADES,
            mode: GameMode.TRUMPF,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS)],
            handCards: [Card.create(11, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.HEARTS)],
            cardToPlay: Card.create(10, Card.CardColor.HEARTS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should allow card if obenabä', () => {
        let parameters = {
            mode: GameMode.OBENABEN,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS)],
            handCards: [Card.create(11, Card.CardColor.SPADES), Card.create(10, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.HEARTS)],
            cardToPlay: Card.create(10, Card.CardColor.HEARTS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should deny card if undäufä and could angeben', () => {
        let parameters = {
            mode: GameMode.UNTENRAUF,
            tableCards: [Card.create(6, Card.CardColor.DIAMONDS)],
            handCards: [Card.create(11, Card.CardColor.SPADES), Card.create(10, Card.CardColor.DIAMONDS), Card.create(10, Card.CardColor.HEARTS)],
            cardToPlay: Card.create(11, Card.CardColor.SPADES)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(!validationResult.permitted);
    });
});

