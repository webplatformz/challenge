"use strict";

let assert = require("assert"); // node.js core module
let Card = require('../../../../shared/deck/card');
let CardColor = require('../../../../shared/deck/cardColor');
let HasCardValidator = require('../../../../server/game/validation/hasCardValidator');
let GameMode = require('../../../../shared/game/gameMode');


describe('Has card validator', function () {

    it('should allow any card in the players hand', () => {
        let parameters = {
            color: CardColor.CLUBS,
            mode: GameMode.TRUMPF,
            tableCards: [],
            handCards: [Card.create(6, CardColor.HEARTS), Card.create(10, CardColor.DIAMONDS)],
            cardToPlay: Card.create(6, CardColor.HEARTS)
        };

        let validationResult = HasCardValidator.validate(parameters);

        assert(validationResult.permitted);
    });

    it('should deny any card not in the players hand', () => {
        let parameters = {
            color: CardColor.CLUBS,
            mode: GameMode.TRUMPF,
            tableCards: [],
            handCards: [Card.create(6, CardColor.HEARTS), Card.create(10, CardColor.DIAMONDS)],
            cardToPlay: Card.create(8, CardColor.HEARTS)
        };

        let validationResult = HasCardValidator.validate(parameters);

        assert(!validationResult.permitted);
    });
});

