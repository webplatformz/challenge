"use strict";

let assert      = require("assert"); // node.js core module
let Game        = require('../../lib/game/game');
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
        clientApiMock.expects('requestTrump').once();
        game = Game.create([], maxPoints, 'dummyPlayer', clientApi);
        clientApiMock.verify();

        assert.notEqual(undefined, game.deck);
        assert.notEqual(undefined, game.players);
        assert.equal(maxPoints, game.maxPoints);
        assert.notEqual(undefined, game.startPlayer);
    });

    it('should request the trumpf from the correct player', () => {
        clientApiMock.expects('requestTrump').once()
            .withArgs(0, false);

        let dummyPlayer = {
            id : 0
        };

        game = Game.create([], maxPoints, dummyPlayer, clientApi);
        clientApiMock.verify();
    });

    afterEach(function () {
        clientApiMock.restore();
    });

});

