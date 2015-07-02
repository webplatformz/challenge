'use strict';

let ClientApi = require('../communication/clientApi');
let Game = require('./game');
let Player = require('./player/player');
let Team = require('./player/team');

let Session = {
    maxPoints: 2500,
    startingPlayer: 0,
    playerNameRequests: [],

    addPlayer: function addPlayer(webSocket) {
        let team = this.teams[this.players.length % 2];
        let player = Player.create(team, 'Player ' + (this.players.length + 1), {
            dealCards: this.clientApi.dealCards.bind(this.clientApi, webSocket),
            requestTrumpf: this.clientApi.requestTrumpf.bind(this.clientApi, webSocket),
            requestCard: this.clientApi.requestCard.bind(this.clientApi, webSocket),
            rejectCard: this.clientApi.rejectCard.bind(this.clientApi, webSocket)
        });

        this.players.push(player);
        this.clientApi.addClient(webSocket);

        this.playerNameRequests.push(this.clientApi.requestPlayerName(webSocket).then((playerName) => {
            player.name = playerName;
        }));
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

        return Promise.all(this.playerNameRequests).then(() => {
            return this.gameCycle();
        });
    },

    gameCycle: function gameCycle(nextStartingPlayer = this.getNextStartingPlayer()) {
        let game = Game.create(this.players, this.maxPoints, this.players[nextStartingPlayer], this.clientApi);

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

