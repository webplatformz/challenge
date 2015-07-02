"use strict";

let assert = require("assert"); // node.js core module
let Card = require('../../../server/game/deck/card');
let HasCardValidator = require('../../../server/game/validation/hasCardValidator');
let GameMode = require('../../../server/game/gameMode');


describe('Has card validator', function () {

    it('should allow any card in the players hand', () => {
        let parameters = {
            color: Card.CardColor.CLUBS,
            mode: GameMode.TRUMPF,
            tableCards: [],
            handCards: [Card.create(6, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(6, Card.CardColor.HEARTS)
        };

        let validationResult = HasCardValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should deny any card not in the players hand', () => {
        let parameters = {
            color: Card.CardColor.CLUBS,
            mode: GameMode.TRUMPF,
            tableCards: [],
            handCards: [Card.create(6, Card.CardColor.HEARTS), Card.create(10, Card.CardColor.DIAMONDS)],
            cardToPlay: Card.create(8, Card.CardColor.HEARTS)
        };

        let validationResult = HasCardValidator.validate(parameters);

        assert(!validationResult.permitted);
    });
});

