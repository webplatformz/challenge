'use strict';

let Deck = require('./deck/deck');

let Game = {

    nextCycle : function(callback) {

    },

    schieben: function() {
        // request trump with the other player in team, isPushed =false
    },
    requestTrumpf: function(player, isGeschoben) {
        let that = this;
        player.requestTrumpf(isGeschoben, this.chooseTrumpf)
            .then(function(gameType) {
                that.gameType = gameType;
                that.clientApi.broadcastTrumpf(gameType);
            });
    },

    start: function() {
        this.requestTrumpf(this.startPlayer, false);
    }
};

let create = function create(players, maxPoints, startPlayer, clientApi) {
    let game = Object.create(Game);
    game.deck = Deck.create();
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

let GameMode = {
    TRUMPF: "Trumpf",
    SLALOM: "Slalom",
    OBENABEN: "Obenaben",
    UNTENRAUF: "Untenrauf"
};

Object.freeze(GameMode);

module.exports = {
    GameMode,
    GameType,
    create
};
