"use strict";

let assert = require("assert");
let Game = require('../../../server/game/game');
let GameMode = require('../../../shared/game/gameMode');
let GameType = require('../../../server/game/gameType');
let CardColor = require('../../../shared/deck/cardColor');
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

    it('should request the trumpf from the correct player when the player schiebs', (done) => {
        var gameModeSchiebe = {
                mode: GameMode.SCHIEBE
            },
            gameModeObeabe = {
                mode: GameMode.OBEABE
            };

        clientApiMock.expects('requestTrumpf').once().withArgs(false).returns(Promise.resolve(gameModeSchiebe));
        clientApiMock.expects('broadcastTrumpf').once().withArgs(gameModeSchiebe);

        clientApiMock.expects('requestTrumpf').once().withArgs(true).returns(Promise.resolve(gameModeObeabe));
        clientApiMock.expects('broadcastTrumpf').once().withArgs(gameModeObeabe);

        let cycle = {
            iterate: () => {
            }
        };

        let cycleMock = sinon.mock(cycle).expects('iterate').exactly(9).returns(Promise.resolve());
        cycleFactoryMock.expects('create').exactly(9).returns(cycle);

        game = Game.create(players, maxPoints, players[0], clientApi);

        game.start().then(() => {
            clientApiMock.verify();
            cycleFactoryMock.verify();
            cycleMock.verify();
            done();
        }).catch(done);

    });

    it('should deny mode SCHIEBE if geschoben', (done) => {
        clientApiMock.expects('requestTrumpf').once().withArgs(false).returns(Promise.resolve({
            mode: GameMode.SCHIEBE
        }));

        clientApiMock.expects('requestTrumpf').once().withArgs(true).returns(Promise.resolve({
            mode: GameMode.SCHIEBE
        }));

        clientApiMock.expects('rejectTrumpf').once().withArgs({mode: GameMode.SCHIEBE});

        clientApiMock.expects('requestTrumpf').once().withArgs(true).returns(Promise.resolve({
            mode: GameMode.SCHIEBE
        }));

        clientApiMock.expects('rejectTrumpf').once().withArgs({mode: GameMode.SCHIEBE});

        clientApiMock.expects('requestTrumpf').once().withArgs(true).returns(Promise.resolve({
            mode: GameMode.OBEABE
        }));

        let cycle = {
            iterate: () => {
            }
        };

        let cycleMock = sinon.mock(cycle).expects('iterate').exactly(9).returns(Promise.resolve());
        cycleFactoryMock.expects('create').exactly(9).returns(cycle);


        game = Game.create(players, maxPoints, players[0], clientApi);

        game.start().then(() => {
            clientApiMock.verify();
            cycleFactoryMock.verify();
            cycleMock.verify();
            done();
        }).catch(done);

    });

    it('should save and broadcast the trumpf when it has been chosen from the player', (done) => {
        let gameMode = GameMode.TRUMPF;
        let cardColor = CardColor.HEARTS;
        let gameType = GameType.create(gameMode, cardColor);

        let cycle = {
            iterate: () => {
            }
        };

        let cycleMock = sinon.mock(cycle).expects('iterate').exactly(9).returns(Promise.resolve());
        cycleFactoryMock.expects('create').exactly(9).returns(cycle);

        clientApiMock.expects('requestTrumpf').once().returns(Promise.resolve(gameType));

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

    it('should start with player who won last cycle', (done) => {
        let gameType = GameType.create(GameMode.TRUMPF, CardColor.CLUBS);

        let cycle = {
            iterate: () => {
            }
        };

        let cycleMock = sinon.mock(cycle).expects('iterate').exactly(9).returns(Promise.resolve(players[2]));
        cycleFactoryMock.expects('create').once().withArgs(players[0], players, clientApi, gameType).returns(cycle);
        cycleFactoryMock.expects('create').exactly(8).withArgs(players[2], players, clientApi, gameType).returns(cycle);

        clientApiMock.expects('requestTrumpf').once().returns(Promise.resolve(gameType));

        game = Game.create(players, maxPoints, players[0], clientApi);

        game.start().then(function () {
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

