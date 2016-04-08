"use strict";

import assert from 'assert';
import Card from '../../../../shared/deck/card';
import {CardColor} from '../../../../shared/deck/cardColor';
import HasCardValidator from '../../../../server/game/validation/hasCardValidator';
import {GameMode} from '../../../../shared/game/gameMode';


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

