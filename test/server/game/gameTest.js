"use strict";

let assert = require("assert"); // node.js core module
let Game = require('../../../server/game/game');
let GameMode = require('../../../server/game/gameMode');
let Player = require('../../../server/game/player/player');
let Card = require('../../../server/game/deck/card');
let clientApi = require('../../../server/communication/clientApi').create();
let Cycle = require('../../../server/game/cycle/cycle');
let sinon = require('sinon');
let TestDataCreator = require('../../testDataCreator');

describe('Game', function () {
    let maxPoints = 2500;
    let game;
    let clientApiMock;
    let cycleFactoryMock;

    let players;

    beforeEach(function () {
        clientApiMock = sinon.mock(clientApi);
        players = TestDataCreator.createPlayers(clientApi);
        cycleFactoryMock = sinon.mock(Cycle);
    });

    it('should properly deal cards to each player', () => {
        game = Game.create(players, maxPoints, players[0], clientApi);

        assert.notEqual(undefined, game.deck);
        assert.notEqual(undefined, game.players);
        assert.equal(maxPoints, game.maxPoints);
        assert.notEqual(undefined, game.startPlayer);
        players.forEach(player => {
            assert.equal(9, player.cards.length);
            player.cards.forEach(card => {
                assert.notEqual(undefined, card);
            });
        });
    });

    it('should request the trumpf from the correct player', () => {
        clientApiMock.expects('requestTrumpf').once()
            .withArgs(false).returns(Promise.resolve());

        let playerWhoSchiebs = players[0];
        assert(playerWhoSchiebs.name === 'hans');
        let hansSpy = sinon.spy(playerWhoSchiebs, 'requestTrumpf');

        game = Game.create(players, maxPoints, players[0], clientApi);
        game.start();

        clientApiMock.verify();
        assert(hansSpy.calledOnce);
    });

    it.skip('should request the trumpf from the correct player when the player schiebs', () => {
        let ex1 = clientApiMock.expects('requestTrumpf').once()
            .withArgs(false).returns(Promise.resolve({
                gameType : 'isEgal',
                schieben : true
            }));

        let ex2 = clientApiMock.expects('requestTrumpf').once()
            .withArgs(true).returns(Promise.resolve({
                gameType : 'isEgal',
                schieben : false
            }));

        let playerWhoSchiebs = players[0];
        let playerWhoGetsGeschoben = players[2];
        assert(playerWhoSchiebs.name === 'hans');
        assert(playerWhoGetsGeschoben.name === 'homer');

        let hansSpy = sinon.spy(playerWhoSchiebs, 'requestTrumpf');
        let homerSpy = sinon.spy(playerWhoGetsGeschoben, 'requestTrumpf');

        game = Game.create(players, maxPoints, players[0], clientApi);
        game.start();

        assert(hansSpy.calledOnce);
        assert(hansSpy.calledWith(false));

        console.log('================================ COUNT : ' + homerSpy.callCount);
        assert(homerSpy.calledOnce);
        assert(homerSpy.calledWith(true));

        ex1.verify();
        //ex2.verify();
    });

    it('should save and broadcast the trumpf when it has been chosen from the player', (done) => {
        let gameMode = GameMode.TRUMPF;
        let cardColor = Card.CardColor.HEARTS;
        let gameType = Game.GameType.create(gameMode, cardColor);

        let cycle = {
            iterate: () => {}
        };

        let cycleMock = sinon.mock(cycle).expects('iterate').exactly(9).returns(Promise.resolve());
        cycleFactoryMock.expects('create').exactly(9).returns(cycle);

        clientApiMock.expects('requestTrumpf').once().returns(Promise.resolve({
            gameType : gameType,
            schieben : false
        }));

        clientApiMock.expects('broadcastTrumpf').once();

        game = Game.create(players, maxPoints, players[0], clientApi);
        game.start().then(function () {
            assert.equal(cardColor, game.gameType.trumpfColor);
            assert.equal(gameMode, game.gameType.mode);
            clientApiMock.verify();
            cycleFactoryMock.verify();
            cycleMock.verify();
            done();
        }).catch(done);
    });

    afterEach(function () {
        clientApiMock.restore();
        cycleFactoryMock.restore();
    });

});

