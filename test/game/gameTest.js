"use strict";

//var assert = require("assert"); // node.js core module
var mockery = require('mockery');

var deckMock = {
    getShuffledCards : function() {
        console.log('hello mockery');
    }
};

describe('Game', function() {
    mockery.enable();
    mockery.registerMock('./deck/deck', deckMock);
    var game = Object.create(require('../../lib/game/game'));


    it('should deal the cards properly', function() {
        game.init();
    });
});