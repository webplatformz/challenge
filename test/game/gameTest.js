"use strict";

let assert      = require("assert"); // node.js core module
let Game        = require('../../lib/game/game');
let Card        = require('../../lib/game/deck/card');
let clientApi   = require('../../lib/communication/clientApi').create();
let sinon       = require('sinon');

describe('Game', function () {
    let maxPoints = 2500;
    let game;
    let clientApiMock;

    beforeEach(function () {
        clientApiMock = sinon.mock(clientApi);
    });

    it('should have a properly initialized deck', () => {
        game = Game.create([], maxPoints, 'dummyPlayer', clientApi);

        assert.notEqual(undefined, game.deck);
        assert.notEqual(undefined, game.players);
        assert.equal(maxPoints, game.maxPoints);
        assert.notEqual(undefined, game.startPlayer);
    });

    it('should request the trumpf from the correct player', () => {
        clientApiMock.expects('requestTrumpf').once()
            .withArgs(0, false);

        let dummyPlayer = {
            id : 0
        };

        game = Game.create([], maxPoints, dummyPlayer, clientApi);
        game.start();

        clientApiMock.verify();
    });

    it('should save the trumpf when it has been chosen from the player', () => {
        clientApiMock.expects('requestTrumpf').once();
        game = Game.create([], maxPoints, 'dummyPlayer', clientApi);
        game.start();
        clientApiMock.verify();

        let gameMode = Game.GameMode.TRUMPF;
        let cardColor = Card.CardType.HEARTS;
        let gameType = Game.GameType.create(gameMode, cardColor);
        game.chooseTrumpf(gameType);

        assert.equal(cardColor, game.gameType.trumpfColor);
        assert.equal(gameMode, game.gameType.mode);
    });

    afterEach(function () {
        clientApiMock.restore();
    });

});

