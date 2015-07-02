'use strict';

let Deck = require('./deck/deck');
let Cycle = require('./cycle/cycle');
let Counter = require('./counter/counter');

let Game = {
    currentRound: 0,

    nextCycle: function () {
        if (this.currentRound < 9) {
            let cycle = Cycle.create(this.startPlayer, this.players, this.clientApi, this.gameType, () => {});
            cycle.iterate().then(() => {
                this.nextCycle();
            });
            this.currentRound++;
        }
    },

    schieben: function () {
        // request trump with the other player in team, isPushed =false
    },


    start: function () {
        return this.startPlayer.requestTrumpf(false)
            .then((gameType) => {
                this.gameType = gameType;
                this.clientApi.broadcastTrumpf(gameType);
                this.nextCycle();
            });
    }
};

let create = function create(players, maxPoints, startPlayer, clientApi) {
    let game = Object.create(Game);
    game.deck = Deck.create();
    players.forEach(player => {
        game.deck.deal(player, 9);
    });

    game.players = players;
    game.maxPoints = maxPoints;
    game.startPlayer = startPlayer;
    game.clientApi = clientApi;
    return game;
};

let GameType = {
    create: function (gameMode, cardColor) {
        return {
            mode: gameMode,
            trumpfColor: cardColor

        };
    }
};

module.exports = {
    GameType,
    create
};
