"use strict";

let assert = require("assert"); // node.js core module
let Game = require('../../lib/game/game');
let GameMode = require('../../lib/game/gameMode');
let Player = require('../../lib/game/player/player');
let Card = require('../../lib/game/deck/card');
let Cycle = require('../../lib/game/cycle/cycle');
let clientApi = require('../../lib/communication/clientApi').create();
let sinon = require('sinon');

describe('Game', function () {
    let maxPoints = 2500;
    let game;
    let clientApiMock;
    let player = Player.create(undefined, "hans", clientApi);
    let player2 = Player.create(undefined, "peter", clientApi);
    let player3 = Player.create(undefined, "luke", clientApi);
    let player4 = Player.create(undefined, "homer", clientApi);
    let players = [player, player2, player3, player4];

    beforeEach(function () {
        clientApiMock = sinon.mock(clientApi);
    });

    it('should properly deal cards to each player', () => {
        game = Game.create(players, maxPoints, player, clientApi);

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

        game = Game.create([player, player, player, player], maxPoints, player, clientApi);
        game.start();

        clientApiMock.verify();
    });

    it('should save and broadcast the trumpf when it has been chosen from the player', (done) => {
        let gameMode = GameMode.TRUMPF;
        let cardColor = Card.CardColor.HEARTS;
        let gameType = Game.GameType.create(gameMode, cardColor);

        clientApiMock.expects('requestTrumpf').once()
            .returns(Promise.resolve(gameType));

        game = Game.create([player, player, player, player], maxPoints, player, clientApi);
        game.start();
        clientApiMock.verify();

        clientApiMock.expects('broadcastTrumpf').once();
        setTimeout(() => {
            assert.equal(cardColor, game.gameType.trumpfColor);
            assert.equal(gameMode, game.gameType.mode);
            clientApiMock.verify();

            //clientApiMock.expects('broadcastCardPlayed').exactly(4);
            // TODO This is not unit testing!! When doing that, mock cycle plz!

            game.nextCycle();

            //clientApiMock.verify();

            done();
        }, 10);
    });

    afterEach(function () {
        clientApiMock.restore();
    });

});

