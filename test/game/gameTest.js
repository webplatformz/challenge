"use strict";

let assert = require("assert"); // node.js core module
let Game = require('../../lib/game/game').Game;

describe('Game', function() {
    let game;

    beforeEach(function(){
        game = Object.create(Game);
    });

    it('should deal the cards properly', function() {
        game.init();
        //assert(deckMock.shuffleCards.called);
    });

    it('should send a command to requestTrump', function() {
        game.init();
        game.chooseTrump();
        // assert that request trump command has been send
    });

    it('should send a command to requestTrump to the next player after the first player pushed', function() {
        game.init();
        game.chooseTrump();
        game.pushTrumpChoice();
        // assert that push command has been send
    });
});