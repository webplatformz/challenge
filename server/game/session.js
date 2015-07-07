'use strict';

let ClientApi = require('../communication/clientApi');
let Game = require('./game');
let Player = require('./player/player');
let Team = require('./player/team');
let CloseEventCode = require('../communication/closeEventCode');

let Session = {
    maxPoints: 2500,
    startingPlayer: 0,

    addPlayer: function addPlayer(webSocket, playerName) {
        let team = this.teams[this.players.length % 2];
        let player = Player.create(team, playerName, this.players.length, {
            dealCards: this.clientApi.dealCards.bind(this.clientApi, webSocket),
            requestTrumpf: this.clientApi.requestTrumpf.bind(this.clientApi, webSocket),
            requestCard: this.clientApi.requestCard.bind(this.clientApi, webSocket),
            rejectCard: this.clientApi.rejectCard.bind(this.clientApi, webSocket)
        });

        this.players.push(player);
        this.clientApi.addClient(webSocket);

        return player;
    },

    isComplete: function isComplete() {
        return this.players.length === 4;
    },

    getNextStartingPlayer: function getNextStartingPlayer() {
        return this.startingPlayer++ % 4;
    },

    start: function start() {
        if (!this.isComplete()) {
            throw 'Not enough players to start game!';
        }

        return this.gameCycle();
    },

    gameCycle: function gameCycle(nextStartingPlayer = this.getNextStartingPlayer()) {
        let players = this.players.slice();
        let game = Game.create(players, this.maxPoints, this.players[nextStartingPlayer], this.clientApi);

        return game.start().then(() => {
            let pointsTeamA = this.teams[0].points;
            let pointsTeamB = this.teams[1].points;

            if (pointsTeamA > pointsTeamB && pointsTeamA >= this.maxPoints) {
                this.clientApi.broadcastWinnerTeam(this.teams[0]);
                return this.teams[0];
            }
            if (pointsTeamB > pointsTeamA && pointsTeamB >= this.maxPoints) {
                this.clientApi.broadcastWinnerTeam(this.teams[1]);
                return this.teams[1];
            }
            return this.gameCycle(this.getNextStartingPlayer());
        });
    },

    close: function close() {
        this.clientApi.closeAll(CloseEventCode.NORMAL, 'Game Finished');
    },

    handlePlayerLeft: function(player, code, message) {

    }
};

let create = function create(name) {
    let session = Object.create(Session);
    session.players = [];
    session.name = name;
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

