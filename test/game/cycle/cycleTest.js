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

    it.only('should return the played cards after each round', (done) => {
        var promise = Promise.resolve({});
        //playerMock.expects('requestCard').returns(Promise.resolve({}));

        sinon.stub(players[0], 'requestCard').returns(Promise.resolve({}));
        sinon.stub(players[1], 'requestCard').returns(Promise.resolve({}));
        sinon.stub(players[2], 'requestCard').returns(Promise.resolve({}));
        sinon.stub(players[3], 'requestCard').returns(Promise.resolve({}));

        let cycle = Cycle.create(players[0], players, clientApi);
        cycle.validator = {
            validate: function() {
                return true;
            }
        };

        cycle.iterate()
            .then(function(playedCards) {
                assert(cycle.turnIndex === 4);
                console.log('turnindex ' + cycle.turnIndex);
                assert(playedCards.length === 4);
                done();
            }).catch(done);

    });

    it('should call the clientapi correctly', () => {
        var promise = Promise.resolve();
        playerMock.expects('requestCard').exactly(1)
            .returns(promise);
        clientApiMock.expects('broadcastCardPlayed').exactly(4);



        let cycle = Cycle.create(players[0], players, clientApi, function() {});
        cycle.validator = {
            validate: function() {
                return true;
            }
        };
        cycle.iterate();

        promise.then(function() {
            clientApiMock.verify();
            playerMock.verify();
        });
    });


    afterEach(function () {
        clientApiMock.restore();
        playerMock.restore();
    });

});

