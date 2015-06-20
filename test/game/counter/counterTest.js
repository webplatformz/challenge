"use strict";

let assert = require("assert"); // node.js core module
let GameMode = require('../../../lib/game/game').GameMode;
let Counter = require('../../../lib/game/counter/counter');
let CardType = require('../../../lib/game/deck/card').CardType;
let Card = require('../../../lib/game/deck/card');


describe('Counter', function() {
    it('should count simple array without Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardType = CardType.SPADES;

        let cardSet = [
            Card.create(6, CardType.DIAMONDS),
            Card.create(12, CardType.DIAMONDS),
            Card.create(14, CardType.DIAMONDS),
            Card.create(10, CardType.DIAMONDS),
            Card.create(11, CardType.HEARTS)];

        let value = Counter.count(mode, cardType, cardSet);
        assert.equal(26, value, 'Cardset value matches');
    });

    it('should count simple array with Trumpf', function() {
        let mode = GameMode.TRUMPF;
        let cardType = CardType.SPADES;

        let cardSet = [
            Card.create(6, CardType.DIAMONDS),
            Card.create(12, CardType.DIAMONDS),
            Card.create(14, CardType.DIAMONDS),
            Card.create(9, CardType.SPADES),
            Card.create(11, CardType.SPADES)];

        let value = Counter.count(mode, cardType, cardSet);
        assert.equal(48, value, 'Cardset value matches');
    });


    it('should count simple array with obenaben', function() {
        let mode = GameMode.OBENABEN;

        let cardSet = [
            Card.create(8, CardType.DIAMONDS),
            Card.create(12, CardType.DIAMONDS),
            Card.create(14, CardType.DIAMONDS),
            Card.create(9, CardType.SPADES),
            Card.create(11, CardType.SPADES)];

        let value = Counter.count(mode, null, cardSet);
        assert.equal(24, value, 'Cardset value matches');
    });

    it('should count simple array with untenrauf', function() {
        let mode = GameMode.UNTENRAUF;

        let cardSet = [
            Card.create(8, CardType.DIAMONDS),
            Card.create(6, CardType.DIAMONDS),
            Card.create(14, CardType.DIAMONDS),
            Card.create(9, CardType.SPADES),
            Card.create(11, CardType.SPADES)];

        let value = Counter.count(mode, null, cardSet);
        assert.equal(21, value, 'Cardset value matches');
    });
    
//    let game;
//
//    beforeEach(function(){
//        game = Object.create(Game);
//    });
//
//    it('should deal the cards properly', function() {
//        game.init();
//        //assert(deckMock.shuffleCards.called);
//    });
//
//    it('should send a command to requestTrump', function() {
//        game.init();
//        game.chooseTrump();
//        // assert that request trump command has been send
//    });
//
//    it('should send a command to requestTrump to the next player after the first player pushed', function() {
//        game.init();
//        game.chooseTrump();
//        game.pushTrumpChoice();
//        // assert that push command has been send
//    });
});