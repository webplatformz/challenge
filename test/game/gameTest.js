"use strict";

let assert = require("assert"); // node.js core module
let Game = require('../../lib/game/game');
let mockery = require('mockery');
let sinon = require('sinon');

let clientApiMock = {
    requestTrumpf: function () {
        return true;
    }
};

describe('Game', function () {
    let maxPoints = 2500;
    let game;
    initMock();

    beforeEach(function () {
        sinon.stub(clientApiMock, 'requestTrumpf');
        game = Game.create([], maxPoints, 'dummyPlayer', clientApiMock);
    });

    it('should have a properly initialized deck', () => {
        assert.notEqual(undefined, game.deck);
        assert.notEqual(undefined, game.players);
        assert.equal(maxPoints, game.maxPoints);
        assert.notEqual(undefined, game.startPlayer);
    });

    it('should request trumpf after initialization', () => {
        sinon.assert.calledOnce(clientApiMock.requestTrumpf);
    });

    afterEach(function () {
        clientApiMock.requestTrumpf.restore();
    });


    function initMock() {
        mockery.enable({
            warnOnUnregistered: false
        });
        mockery.registerMock('./deck/deck', clientApiMock);
    }
});

