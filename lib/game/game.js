'use strict';

let Deck = require('./deck/deck');
let Trick = require('./trick/trick');

let Game = {

    chooseTrump: function chooseTrump(color) {

    },

    pushTrumpChoice: function pushTrumpChoice() {
        // request trump with the other player in team, isPushed =false
    },

    requestTrumpf: function() {
        this.clientApi.requestTrumpf();
    }
};

let create = function create(players, maxPoints, startPlayer, clientApi) {
    let game = Object.create(Game);
    game.deck = Deck.create();
    game.players = players;
    game.maxPoints = maxPoints;
    game.startPlayer = startPlayer;
    game.clientApi = clientApi;
    game.requestTrumpf();
    return game;
};

module.exports = {
    create
};