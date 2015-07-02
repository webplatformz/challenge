"use strict";

let assert = require("assert");
let GameMode = require('../../../../server/game/gameMode');
let StichGranter = require('../../../../server/game/cycle/stichGranter');
let CardColor = require('../../../../server/game/deck/card').CardColor;
let Card = require('../../../../server/game/deck/card');
let TestDataCreator = require('../../../testDataCreator');
let clientApi = require('../../../../server/communication/clientApi').create();


describe('StichGranter', function () {
    let players;

    beforeEach(function () {
        players = TestDataCreator.createPlayers(clientApi);
    });


    it('should determine the correct winner when the mode is Trumpf and no Trumpf is played', function () {
        let mode = GameMode.TRUMPF;
        let cardColor = CardColor.SPADES;

        let winnerCard = Card.create(14, CardColor.DIAMONDS);
        let expectedWinner = players[0];

        let cardSet = [
            winnerCard,
            Card.create(6, CardColor.DIAMONDS),
            Card.create(12, CardColor.DIAMONDS),
            Card.create(10, CardColor.DIAMONDS)];

        let actualWinner = StichGranter.determineWinner(mode, cardColor, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

    it('should determine the correct winner when the mode is Trumpf and Trumpf is played ', function () {
        let mode = GameMode.TRUMPF;
        let trumpfColor = CardColor.SPADES;

        let winnerCard = Card.create(6, CardColor.SPADES);
        let expectedWinner = players[1];

        let cardSet = [
            Card.create(6, CardColor.DIAMONDS),
            winnerCard,
            Card.create(12, CardColor.DIAMONDS),
            Card.create(10, CardColor.DIAMONDS)];

        let actualWinner = StichGranter.determineWinner(mode, trumpfColor, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

    it('should determine the correct winner when the mode is Trumpf and two Trumpfs are played', function () {
        let mode = GameMode.TRUMPF;
        let trumpfColor = CardColor.SPADES;

        let winnerCard = Card.create(10, CardColor.SPADES);
        let expectedWinner = players[3];

        let cardSet = [
            Card.create(6, CardColor.SPADES),
            Card.create(12, CardColor.DIAMONDS),
            Card.create(10, CardColor.DIAMONDS),
            winnerCard
        ];

        let actualWinner = StichGranter.determineWinner(mode, trumpfColor, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

    it('should determine the correct winner when the mode is Trumpf and Buur is played', function () {
        let mode = GameMode.TRUMPF;
        let trumpfColor = CardColor.SPADES;

        let winnerCard = Card.create(11, CardColor.SPADES);
        let expectedWinner = players[3];

        let cardSet = [
            Card.create(12, CardColor.SPADES),
            Card.create(12, CardColor.DIAMONDS),
            Card.create(10, CardColor.DIAMONDS),
            winnerCard
        ];

        let actualWinner = StichGranter.determineWinner(mode, trumpfColor, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

    it('should determine the correct winner when the mode is Trumpf and Nell is played', function () {
        let mode = GameMode.TRUMPF;
        let trumpfColor = CardColor.SPADES;

        let winnerCard = Card.create(9, CardColor.SPADES);
        let expectedWinner = players[3];

        let cardSet = [
            Card.create(12, CardColor.SPADES),
            Card.create(12, CardColor.DIAMONDS),
            Card.create(10, CardColor.DIAMONDS),
            winnerCard
        ];

        let actualWinner = StichGranter.determineWinner(mode, trumpfColor, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

    it('should determine the correct winner when the mode is Trumpf and Buur and Nell are played', function () {
        let mode = GameMode.TRUMPF;
        let trumpfColor = CardColor.SPADES;

        let winnerCard = Card.create(11, CardColor.SPADES);
        let expectedWinner = players[0];

        let cardSet = [
            winnerCard,
            Card.create(12, CardColor.DIAMONDS),
            Card.create(10, CardColor.DIAMONDS),
            Card.create(9, CardColor.SPADES)
        ];

        let actualWinner = StichGranter.determineWinner(mode, trumpfColor, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

    it('should determine the correct winner when the mode is Untenrauf and all cards have the same color', function () {
        let mode = GameMode.UNTENRAUF;

        let winnerCard = Card.create(6, CardColor.DIAMONDS);
        let expectedWinner = players[2];

        let cardSet = [
            Card.create(8, CardColor.DIAMONDS),
            Card.create(12, CardColor.DIAMONDS),
            winnerCard,
            Card.create(10, CardColor.DIAMONDS)
        ];

        let actualWinner = StichGranter.determineWinner(mode, undefined, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

    it('should determine the correct winner when the mode is Obenaben and all cards have the same color', function () {
        let mode = GameMode.OBENABEN;

        let winnerCard = Card.create(10, CardColor.SPADES);
        let expectedWinner = players[1];

        let cardSet = [
            Card.create(8, CardColor.SPADES),
            winnerCard,
            Card.create(9, CardColor.SPADES),
            Card.create(6, CardColor.SPADES)
        ];

        let actualWinner = StichGranter.determineWinner(mode, undefined, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

    it('should determine the correct winner when the mode is Obenaben and cards have several colors', function () {
        let mode = GameMode.OBENABEN;

        let winnerCard = Card.create(10, CardColor.SPADES);
        let expectedWinner = players[1];

        let cardSet = [
            Card.create(8, CardColor.SPADES),
            winnerCard,
            Card.create(14, CardColor.DIAMONDS),
            Card.create(12, CardColor.DIAMONDS)
        ];

        let actualWinner = StichGranter.determineWinner(mode, undefined, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

    it('should determine the correct winner when the mode is Untenrauf and cards have several colors', function () {
        let mode = GameMode.UNTENRAUF;

        let winnerCard = Card.create(14, CardColor.CLUBS);
        let expectedWinner = players[0];

        let cardSet = [
            winnerCard,
            Card.create(8, CardColor.SPADES),
            Card.create(14, CardColor.DIAMONDS),
            Card.create(12, CardColor.DIAMONDS)
        ];

        let actualWinner = StichGranter.determineWinner(mode, undefined, cardSet, players);
        assert.equal(expectedWinner, actualWinner);
    });

});