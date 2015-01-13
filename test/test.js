"use strict";

//var assert = require("assert"); // node.js core module
var card = require("../lib/game/card.js");


describe('Game', function(){

    describe('Card', function(){
        it('Create a new card', function(){
            new card.Card(2, card.CardType.HEARTS);
        });
    });
});
