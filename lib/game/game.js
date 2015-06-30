'use strict';

let Deck = require('./deck/deck');
let Cycle = require('./cycle/cycle');
let Counter = require('./counter/counter');


let Game = {

    nextCycle : function() {
        let cycle = Cycle.create(this.startPlayer, this.players, this.clientApi, () => {});
        cycle.iterate();
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
                that.nextCycle();
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

module.exports = {
    GameType,
    create
};
