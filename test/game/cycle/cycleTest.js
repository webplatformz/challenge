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
        let cardsPlayedCount = 0;
        let callbackSpy = {
          callback : function callback(cardsPlayed) {
              cardsPlayedCount = cardsPlayed.length;
          }
        };
        sinon.spy(callbackSpy, 'callback');

        let cycle = Cycle.create(player, [player, player, player, player], clientApi, callbackSpy.callback);
        cycle.iterate();

        assert(cycle.turnIndex === 4);
        assert(cardsPlayedCount === 4);
        assert(callbackSpy.callback.calledOnce);
    });

    it('should call the clientapi correctly', () => {
        playerMock.expects('requestCard').exactly(4);
        clientApiMock.expects('broadcastCardPlayed').exactly(4);

        let cycle = Cycle.create(player, [player, player, player, player], clientApi, function() {});
        cycle.iterate();

        clientApiMock.verify();
        playerMock.verify();
    });


    afterEach(function () {
        clientApiMock.restore();
        playerMock.restore();
    });

});

