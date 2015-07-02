"use strict";

let assert = require("assert"); // node.js core module
let expect = require('chai').expect;
let Card = require('../../../lib/game/deck/card');
let Cycle = require('../../../lib/game/cycle/cycle');
let clientApi = require('../../../lib/communication/clientApi').create();
let Player = require('../../../lib/game/player/player');
let TestDataCreator = require('../../testDataCreator');
let sinon = require('sinon');
let GameType = require('../../../lib/game/game').GameType;
let GameMode = require('../../../lib/game/gameMode');

describe('Cycle', function () {
    let clientApiMock;
    let playerMock;
    let players;
    let gameType;

    beforeEach(function () {
        clientApiMock = sinon.mock(clientApi);
        players = TestDataCreator.createPlayers(clientApiMock);
        playerMock = sinon.mock(players[0]);
        gameType = GameType.create(GameMode.TRUMPF, Card.CardColor.DIAMONDS);
    });

    it('should return the played cards after each round', (done) => {
        sinon.stub(players[0], 'requestCard').returns(Promise.resolve('a'));
        sinon.stub(players[1], 'requestCard').returns(Promise.resolve('b'));
        sinon.stub(players[2], 'requestCard').returns(Promise.resolve('c'));
        sinon.stub(players[3], 'requestCard').returns(Promise.resolve('d'));

        let cycle = Cycle.create(players[0], players, clientApi, gameType);
        cycle.validator = {
            validate: function () {
                return true;
            }
        };

        cycle.iterate()
            .then(function (playedCards) {
                expect(playedCards).to.eql(['a', 'b', 'c', 'd']);
                done();
            }).catch(done);
    });

    it('should start with currentPlayer', (done) => {
        sinon.stub(players[0], 'requestCard').returns(Promise.resolve('a'));
        sinon.stub(players[1], 'requestCard').returns(Promise.resolve('b'));
        sinon.stub(players[2], 'requestCard').returns(Promise.resolve('c'));
        sinon.stub(players[3], 'requestCard').returns(Promise.resolve('d'));

        let cycle = Cycle.create(players[1], players, clientApi, gameType);
        cycle.validator = {
            validate: function () {
                return true;
            }
        };

        cycle.iterate()
            .then(function (playedCards) {
                expect(playedCards).to.eql(['b', 'c', 'd', 'a']);
                done();
            }).catch(done);
    });

    it('should call the clientapi correctly', () => {
        var promise = Promise.resolve();
        playerMock.expects('requestCard').exactly(1)
            .returns(promise);
        clientApiMock.expects('broadcastCardPlayed').exactly(4);


        let cycle = Cycle.create(players[0], players, clientApi, gameType);
        cycle.validator = {
            validate: function () {
                return true;
            }
        };
        cycle.iterate();

        promise.then(function () {
            clientApiMock.verify();
            playerMock.verify();
        });
    });


    afterEach(function () {
        clientApiMock.restore();
        playerMock.restore();
    });

});

