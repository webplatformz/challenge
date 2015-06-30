"use strict";

let assert      = require("assert"); // node.js core module
let Card        = require('../../../lib/game/deck/card');
let Cycle       = require('../../../lib/game/cycle/cycle');
let clientApi   = require('../../../lib/communication/clientApi').create();
let Player      = require('../../../lib/game/player/player');
let TestDataCreator = require('../../testDataCreator');

let sinon       = require('sinon');

describe('Cycle', function () {
    let clientApiMock;
    let playerMock;
    let players;

    beforeEach(function () {
        clientApiMock = sinon.mock(clientApi);
        players = TestDataCreator.createPlayers(clientApiMock);
        playerMock = sinon.mock(players[0]);
    });

    it('should call the callback after each round', () => {
        let cardsPlayedCount = 0;
        let callbackSpy = {
          callback : function callback(cardsPlayed) {
              cardsPlayedCount = cardsPlayed.length;
          }
        };
        sinon.spy(callbackSpy, 'callback');


        let cycle = Cycle.create(players[0], players, clientApi, callbackSpy.callback);
        cycle.validator = {
            validate: function() {
                return true;
            }
        };

        cycle.iterate();

        assert(cycle.turnIndex === 4);
        assert(cardsPlayedCount === 4);
        assert(callbackSpy.callback.calledOnce);
    });

    it('should call the clientapi correctly', () => {
        playerMock.expects('requestCard').exactly(1);
        clientApiMock.expects('broadcastCardPlayed').exactly(4);

        let cycle = Cycle.create(players[0], players, clientApi, function() {});
        cycle.validator = {
            validate: function() {
                return true;
            }
        };
        cycle.iterate();

        clientApiMock.verify();
        playerMock.verify();
    });


    afterEach(function () {
        clientApiMock.restore();
        playerMock.restore();
    });

});

