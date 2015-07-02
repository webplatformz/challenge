'use strict';

let Card = require('../shared/deck/card');
let Deck = require('../server/game/deck/deck');
let Player = require('../server/game/player/player');
let Team = require('../server/game/player/team');

let createDummyPlayer = function (teamName, name, clientApiMock) {
    let team =  Team.create(teamName);
    let player = Player.create(team, name, clientApiMock);
    player.requestCard = function() {
      return Promise.resolve(player.cards[0]);
    };
    player.dealCards = function(cards) {
        player.cards = cards;
    };

    return player;
};

let TestDataCreator = {
    createPlayers: function (clientApiMock) {
        let deck = Deck.create();
        let player1 = createDummyPlayer("team1", "hans", clientApiMock);
        let player2 = createDummyPlayer("team2", "peter", clientApiMock);
        let player3 = createDummyPlayer("team1", "homer", clientApiMock);
        let player4 = createDummyPlayer("team2", "luke", clientApiMock);
        let players = [player1, player2, player3, player4];
        players.forEach(player => {
            deck.deal(player, 9);
        });
        return players;
    }
};

module.exports = TestDataCreator;