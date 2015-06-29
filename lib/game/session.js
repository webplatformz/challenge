'use strict';

let ClientApi = require('../communication/clientApi');
let Game = require('./game');
let Player = require('./player/player');
let Team = require('./player/team');

let nextPlayer = 0;


function getNextPlayer() {
    return nextPlayer++ % 4;
}

let Session = {
    maxPoints: 2500,

    addPlayer: function addPlayer(webSocket) {
        let team = this.teams[this.players.length % 2];
        let playerClientApi = {
            requestTrumpf: this.clientApi.requestTrumpf.bind(this.clientApi, webSocket)
        };
        let player = Player.create(team, 'player', playerClientApi);

        this.players.push(player);
        this.clientApi.addClient(webSocket);
    },

    isComplete: function isComplete() {
        return this.players.length === 4;
    },

    startGame: function startGame() {
        if (!this.isComplete()) {
            throw 'Not enough players to start game!';
        }

        Game.create(this.players, this.maxPoints, this.players[getNextPlayer()], this.clientApi);
    }
};

let create = function create() {
    let session = Object.create(Session);
    session.players = [];
    session.teams = [
        Team.create('Team 1'),
        Team.create('Team 2')
    ];
    session.clientApi = ClientApi.create();
    return session;
};

module.exports = {
    create
};

