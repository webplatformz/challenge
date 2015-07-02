"use strict";

let assert = require("assert"); // node.js core module
let expect = require('chai').expect;
let Card = require('../../../../shared/deck/card');
let Cycle = require('../../../../server/game/cycle/cycle');
let clientApi = require('../../../../server/communication/clientApi').create();
let Player = require('../../../../server/game/player/player');
let TestDataCreator = require('../../../testDataCreator');
let sinon = require('sinon');
let GameType = require('../../../../server/game/game').GameType;
let GameMode = require('../../../../server/game/gameMode');
let Deck = require('../../../../server/game/deck/deck');

describe('Cycle', function () {
    let clientApiMock;
    let playerMock;
    let players;
    let gameType;
    let cards;

    beforeEach(function () {
        clientApiMock = sinon.mock(clientApi);
        players = TestDataCreator.createPlayers(clientApiMock);
        playerMock = sinon.mock(players[0]);
        gameType = GameType.create(GameMode.TRUMPF, Card.CardColor.DIAMONDS);
        cards = Deck.create().cards;
    });

    it('should return the player who won after each cycle', (done) => {
        sinon.stub(players[0], 'requestCard').returns(Promise.resolve(cards[0]));
        sinon.stub(players[1], 'requestCard').returns(Promise.resolve(cards[1]));
        sinon.stub(players[2], 'requestCard').returns(Promise.resolve(cards[2]));
        sinon.stub(players[3], 'requestCard').returns(Promise.resolve(cards[3]));

        let cycle = Cycle.create(players[0], players, clientApi, gameType);
        cycle.validator = {
            validate: function () {
                return true;
            }
        };

        cycle.iterate()
            .then(function (winner) {
                expect(players).to.include(winner);
                done();
            }).catch(done);
    });

    it('should start with currentPlayer', (done) => {
        sinon.stub(players[0], 'requestCard').returns(Promise.resolve(cards[1]));
        sinon.stub(players[1], 'requestCard').returns(Promise.resolve(cards[2]));
        sinon.stub(players[2], 'requestCard').returns(Promise.resolve(cards[3]));
        sinon.stub(players[3], 'requestCard').returns(Promise.resolve(cards[0]));

        let cycle = Cycle.create(players[1], players, clientApi, gameType);
        cycle.validator = {
            validate: function () {
                return true;
            }
        };

        clientApiMock.expects('broadcastCardPlayed').withArgs([cards[2]]).once();
        clientApiMock.expects('broadcastCardPlayed').withArgs([cards[2], cards[3]]).once();
        clientApiMock.expects('broadcastCardPlayed').withArgs([cards[2], cards[3], cards[0]]).once();
        clientApiMock.expects('broadcastCardPlayed').withArgs([cards[2], cards[3], cards[0], cards[1]]).once();

        cycle.iterate()
            .then(function () {
                clientApiMock.verify();
                done();
            }).catch(done);
    });

    it('should call the clientapi correctly', (done) => {
        playerMock.expects('requestCard').exactly(1).returns(Promise.resolve(cards[0]));
        clientApiMock.expects('broadcastCardPlayed').exactly(4);
        clientApiMock.expects('broadcastStich').exactly(1);

        let cycle = Cycle.create(players[0], players, clientApi, gameType);
        cycle.validator = {
            validate: function () {
                return true;
            }
        };

        let promise = cycle.iterate();

        promise.then(function () {
            clientApiMock.verify();
            playerMock.verify();
            done();
        }).catch(done);
    });


    afterEach(function () {
        clientApiMock.restore();
        playerMock.restore();
    });

});

