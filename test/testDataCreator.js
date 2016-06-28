'use strict';

import * as Deck from '../server/game/deck/deck';
import * as Player from '../server/game/player/player';
import * as Team from '../server/game/player/team';

let createDummyPlayer = function (teamName, name, id, seatId, clientApiMock) {
    let team = Team.create(teamName);
    let player = Player.create(team, name, id, seatId, clientApiMock);
    player.requestCard = function () {
        return Promise.resolve(player.cards[0]);
    };
    player.dealCards = function (cards) {
        player.cards = cards;
    };

    return player;
};

export function createPlayers(clientApiMock) {
    let deck = Deck.create();
    let player1 = createDummyPlayer("Team 1", "hans", "uuid-1", 0, clientApiMock);
    let player2 = createDummyPlayer("Team 2", "peter", "uuid-2", 1, clientApiMock);
    let player3 = createDummyPlayer("Team 1", "homer", "uuid-3", 2, clientApiMock);
    let player4 = createDummyPlayer("Team 2", "luke", "uuid-4", 3, clientApiMock);
    let players = [player1, player2, player3, player4];
    players.forEach(player => {
        deck.deal(player, 9);
    });
    return players;
}