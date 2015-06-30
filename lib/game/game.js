'use strict';

let Deck = require('./deck/deck');
let Cycle = require('./cycle/cycle');
let Counter = require('./counter/counter');

let Game = {

    nextCycle: function () {
        let cycle = Cycle.create(this.startPlayer, this.players, this.clientApi);
        cycle.iterate();

        //let currentRound = 0;
        //cycle.iterate().then(function () {
        //    currentRound++;
        //    if (currentRound < 9) {
        //        let cycle = Cycle.create(this.startPlayer, this.players, this.clientApi);
        //
        //    } else {
        //
        //    }
        //});
    },

    schieben: function () {
        // request trump with the other player in team, isPushed =false
    },

    requestTrumpf: function (player, isGeschoben) {
        let that = this;
        return player.requestTrumpf(isGeschoben, this.chooseTrumpf)
            .then(function (gameType) {
                that.gameType = gameType;
                that.clientApi.broadcastTrumpf(gameType);
                console.log("called client api");
            });
    },

    start: function () {
        this.startPlayer.requestTrumpf(false)
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
