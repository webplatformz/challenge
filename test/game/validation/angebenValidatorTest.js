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
            handCards: [],
            cardToPlay: Card.create(6, Card.CardType.HEARTS)
        };

        let validationResult = AngebenValidator.validate(parameters);

        assert(validationResult.permitted);
    });
});

