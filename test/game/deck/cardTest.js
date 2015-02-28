"use strict";

var Card = require('../../../lib/game/deck/card');

describe('Card', function() {
    it('should be possible to create cards', function() {
        var card = new Card.Card(6, Card.CardType.DIAMONDS);

    });

});