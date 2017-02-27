import { expect } from 'chai';
import * as Game from '../../../server/game/game';
import { GameMode } from '../../../shared/game/gameMode';
import * as GameType from '../../../server/game/gameType';
import { CardColor } from '../../../shared/deck/cardColor';
import * as ClientApi from '../../../server/communication/clientApi';
import * as Cycle from '../../../server/game/cycle/cycle';
import sinon from 'sinon';
import * as TestDataCreator from '../../testDataCreator';

describe('Game', function () {
    let clientApi = ClientApi.create();
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

        expect(game.deck).to.be.defined;
        expect(game.players).to.be.defined;
        expect(game.maxPoints).to.equal(maxPoints);
        expect(game.startPlayer).to.be.defined;
        players.forEach(player => {
            expect(player.cards.length).to.equal(9);
            player.cards.forEach(card => {
                expect(card).not.to.be.undefined;
            });
        });
    });

    it('should request the trumpf from the correct player', () => {
        clientApiMock.expects('requestTrumpf').once()
            .withArgs(false).returns(Promise.reject());

        let playerWhoSchiebs = players[0];
        expect(playerWhoSchiebs.name).to.equal('hans');
        let hansSpy = sinon.spy(playerWhoSchiebs, 'requestTrumpf');

        game = Game.create(players, maxPoints, players[0], clientApi);
        game.start().catch(() => { /* ignore rejected promise */
        });

        clientApiMock.verify();
        sinon.assert.calledOnce(hansSpy);
    });

    it('should return error object when requesting trumpf exceeded timeout', (done) => {
        const errorMessage = 'some error message';
        clientApiMock.expects('requestTrumpf').once()
            .withArgs(false).returns(Promise.reject(errorMessage));
        game = Game.create(players, maxPoints, players[0], clientApi);

        game.start()
            .catch((errorObject) => {
                expect(errorObject.message).to.equal(errorMessage);
                expect(errorObject.data).to.eql(players[0]);
                clientApiMock.verify();
                done();
            })
            .catch(done);
    });

    it('should return error object when requesting geschoben trumpf exceeded timeout', (done) => {
        const errorMessage = 'some error message';
        clientApiMock.expects('requestTrumpf').once().returns(Promise.resolve({ mode: GameMode.SCHIEBE }));
        clientApiMock.expects('requestTrumpf').once().returns(Promise.reject(errorMessage));
        game = Game.create(players, maxPoints, players[0], clientApi);

        game.start()
            .catch((errorObject) => {
                expect(errorObject.message).to.equal(errorMessage);
                expect(errorObject.data).to.eql(players[0]);
                clientApiMock.verify();
                done();
            })
            .catch(done);
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

        clientApiMock.expects('rejectTrumpf').once().withArgs({ mode: GameMode.SCHIEBE });

        clientApiMock.expects('requestTrumpf').once().withArgs(true).returns(Promise.resolve({
            mode: GameMode.SCHIEBE
        }));

        clientApiMock.expects('rejectTrumpf').once().withArgs({ mode: GameMode.SCHIEBE });

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
            expect(game.gameType.trumpfColor).to.equal(cardColor);
            expect(game.gameType.mode).to.equal(gameMode);
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

