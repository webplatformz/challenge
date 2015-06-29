'use strict';

let Deck = require('./deck/deck');
let Trick = require('./trick/trick');

let Game = {

    chooseTrump: function chooseTrump(color) {

    },

    pushTrumpChoice: function pushTrumpChoice() {
        // request trump with the other player in team, isPushed =false
    },

    requestTrumpf: function(playerId, isGeschoben) {
        this.clientApi.requestTrump(playerId, isGeschoben);
    },

    start: function() {
        this.requestTrumpf(this.startPlayer.id, false);
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
    create: function (gameMode, cardColor){
        let gameType = Object.create(GameType);
        this.mode = gameMode;
        this.trumpfColor = cardColor;
        return gameType;
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
    GameMode : GameMode,
    GameType : GameType,
    create : create
};
