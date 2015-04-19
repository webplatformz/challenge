"use strict";

//let assert = require("assert"); // node.js core module
let card = require("../lib/game/deck/card.js");


describe('Game', function(){

    describe('Card', function(){
        it('Create a new card', function(){
            new card.Card(2, card.CardType.HEARTS);
        });
    });
});
