"use strict";

import {expect} from 'chai';
import * as Card from '../../../../shared/deck/card';
import {CardColor} from '../../../../shared/deck/cardColor';
import * as Cycle from '../../../../server/game/cycle/cycle';
import * as ClientApi from '../../../../server/communication/clientApi';
import * as TestDataCreator from '../../../testDataCreator';
import sinon from 'sinon';
import * as GameType from '../../../../server/game/gameType';
import {GameMode} from '../../../../shared/game/gameMode';
import * as Deck from '../../../../server/game/deck/deck';

describe('Cycle', function () {
    let clientApi = ClientApi.create();
    let clientApiMock;
    let playerMock;
    let players;
    let gameType;
    let cards;

    beforeEach(function () {
        clientApiMock = sinon.mock(clientApi);
        players = TestDataCreator.createPlayers(clientApiMock);
        playerMock = sinon.mock(players[0]);
        gameType = GameType.create(GameMode.TRUMPF, CardColor.DIAMONDS);
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

    it('should broadcast the correct message', (done) => {
        let winnerCard = Card.create(11, CardColor.DIAMONDS);
        let card2 = Card.create(10, CardColor.DIAMONDS);
        let card3 = Card.create(6, CardColor.DIAMONDS);
        let card4 = Card.create(7, CardColor.DIAMONDS);

        let expectedStichMessage = {
            "name": "hans",
            "id": 0,
            "playedCards": [card2, card3, card4, winnerCard],
            "teams": [{"name": "Team 1", "points": 30, "currentRoundPoints":30}, {"name": "Team 2", "points": 0, "currentRoundPoints":0}]
        };

        clientApiMock.expects('broadcastStich').exactly(1).withArgs(expectedStichMessage);

        sinon.stub(players[0], 'requestCard').returns(Promise.resolve(winnerCard));
        sinon.stub(players[1], 'requestCard').returns(Promise.resolve(card2));
        sinon.stub(players[2], 'requestCard').returns(Promise.resolve(card3));
        sinon.stub(players[3], 'requestCard').returns(Promise.resolve(card4));

        let cycle = Cycle.create(players[1], players, clientApi, gameType);
        cycle.validator = {
            validate: function () {
                return true;
            }
        };

        cycle.iterate()
            .then(function () {
                clientApiMock.verify();
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

})
;

