"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../lib/game/deck/card');
let Cycle       = require('../../../lib/game/cycle/cycle');
let clientApi   = require('../../../lib/communication/clientApi').create();
let player      = require('../../../lib/game/player/player').create();

let sinon       = require('sinon');

describe('Cycle', function () {
    let maxPoints = 2500;
    let game;
    let clientApiMock;
    let playerMock;

    beforeEach(function () {
        clientApiMock = sinon.mock(clientApi);
        playerMock = sinon.mock(player);
    });

    it('should call the callback after each round', () => {
        let callbackSpy = {
          callback : function callback() {
          }
        };
        sinon.spy(callbackSpy, 'callback');

        let cycle = Cycle.create(0, [player, player, player, player], 0, clientApi, callbackSpy.callback);
        cycle.iterate();

        assert(callbackSpy.callback.calledOnce);
    });

    //it('should have a properly initialized deck', () => {
    //    game = Game.create([], maxPoints, 'dummyPlayer', clientApi);
    //
    //    assert.notEqual(undefined, game.deck);
    //    assert.notEqual(undefined, game.players);
    //    assert.equal(maxPoints, game.maxPoints);
    //    assert.notEqual(undefined, game.startPlayer);
    //});
    //
    //it('should request the trumpf from the correct player', () => {
    //    clientApiMock.expects('requestTrump').once()
    //        .withArgs(0, false);
    //
    //    let dummyPlayer = {
    //        id : 0
    //    };
    //
    //    game = Game.create([], maxPoints, dummyPlayer, clientApi);
    //    game.start();
    //
    //    clientApiMock.verify();
    //});
    //
    //it('should save the trumpf when it has been chosen from the player', () => {
    //    clientApiMock.expects('requestTrump').once();
    //    game = Game.create([], maxPoints, 'dummyPlayer', clientApi);
    //    game.start();
    //    clientApiMock.verify();
    //
    //    let gameMode = Game.GameMode.TRUMPF;
    //    let cardColor = Card.CardType.HEARTS;
    //    let gameType = Game.GameType.create(gameMode, cardColor);
    //    game.chooseTrumpf(gameType);
    //
    //    assert.equal(cardColor, game.gameType.trumpfColor);
    //    assert.equal(gameMode, game.gameType.mode);
    //});

    afterEach(function () {
        clientApiMock.restore();
    });

});

