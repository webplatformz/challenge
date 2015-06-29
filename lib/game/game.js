'use strict';

let Deck    = require('./deck/deck');
let Trick   = require('./trick/trick');

let Game = {

    init : function init(teams, maxPoints) {
        let deck = Object.create(Deck);
        this.teams = teams;
        this.maxPoints = maxPoints;
    },

    /**
     *
     * @param color enum Color
     */
    chooseTrump: function chooseTrump(color) {

    },
    pushTrumpChoice : function pushTrumpChoice() {
        // request trump with the other player in team, isPushed =false
    }
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
    Game : Game
};