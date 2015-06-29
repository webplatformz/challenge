'use strict';

let ClientApi = require('../communication/clientApi');
let Game = require('./game');
let Player = require('./player/player');
let Team = require('./player/team');

let Session = {
    maxPoints: 2500,

    addPlayer: function addPlayer(webSocket) {
        let team = this.teams[this.players.length % 2];
        let player = Player.create(webSocket, team);

        this.players.push(player);
    },

    isComplete: function isComplete() {
        return this.players.length === 4;
    },

    startGame: function startGame() {
        if (!this.isComplete()) {
            throw 'Not enough players to start game!';
        }

        let clientApi = ClientApi.create(this.players.map((element) => {
            return element.webSocket;
        }));

        //let game = Object.create(Game);
        //game.init(this.teams, this.maxPoints, {
        //    requestTrump: clientApi.requestTrump
        //});
    }
};


let create = function create() {
    let session = Object.create(Session);
    session.players = [];
    session.teams = [
        Team.create('Team 1'),
        Team.create('Team 2')
    ];
    return session;
};

module.exports = {
    create
};

