'use strict';

let Deck = require('./deck/deck');
let Cycle = require('./cycle/cycle');
let Counter = require('./counter/counter');
let GameMode = require('./gameMode');

let Game = {
    currentRound: 0,

    nextCycle: function (startPlayer) {
        if (this.currentRound < 9) {
            this.startPlayer = startPlayer || this.startPlayer;
            let cycle = Cycle.create(this.startPlayer, this.players, this.clientApi, this.gameType);
            this.currentRound++;
            return cycle.iterate().then((winner) => {
                return this.nextCycle(winner);
            });
        }
    },

    schieben: function () {
        for(let i = 0; i < this.players.length; i++) {
            let actPlayer = this.players[i];
            if (actPlayer !== this.startPlayer && actPlayer.team.name === this.startPlayer.team.name) {
                return actPlayer.requestTrumpf(true)
                    .then((gameType) => {
                        this.gameType = gameType;
                        this.clientApi.broadcastTrumpf(this.createBroadcastTrumpfMessage(gameType));
                        return this.nextCycle();
                    });
            }
        }
    },

    start: function () {
        return this.startPlayer.requestTrumpf(false)
            .then((gameType) => {
                if (gameType.mode === GameMode.SCHIEBEN) {
                    return this.schieben();
                } else {
                    this.gameType = gameType;
                    this.clientApi.broadcastTrumpf(this.createBroadcastTrumpfMessage(gameType));
                    return this.nextCycle();
                }
            });
    },

    createBroadcastTrumpfMessage : function(gameType) {
        return gameType.mode === GameMode.TRUMPF ? gameType : gameType.mode;
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
