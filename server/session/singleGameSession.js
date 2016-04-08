'use strict';

import ClientApi from '../communication/clientApi.js';
import Game from '../game/game.js';
import Player from '../game/player/player.js';
import Team from '../game/player/team.js';
import {SessionType} from '../../shared/session/sessionType.js';
import SessionHandler from './sessionHandler';

function createTeamsArrayForClient(session) {
    return session.teams.map((team) => {
        return {
            name: team.name,
            players: session.players.filter((player) => {
                return player.team.name === team.name;
            }).map((player) => {
                return {
                    name: player.name,
                    id: player.id
                };
            })
        };
    });
}

let Session = {
    maxPoints: 2500,
    startingPlayer: 0,
    type: SessionType.SINGLE_GAME,
    gamePromise: undefined,
    finishGame: undefined,
    cancelGame: undefined,
    started: false,

    addPlayer: function addPlayer(webSocket, playerName) {
        let team = this.teams[this.players.length % 2];
        team.name = team.name + " " + playerName;
        let player = Player.create(team, playerName, this.players.length, {
            dealCards: this.clientApi.dealCards.bind(this.clientApi, webSocket),
            requestTrumpf: this.clientApi.requestTrumpf.bind(this.clientApi, webSocket),
            requestCard: this.clientApi.requestCard.bind(this.clientApi, webSocket),
            rejectCard: this.clientApi.rejectCard.bind(this.clientApi, webSocket),
            rejectTrumpf: this.clientApi.rejectTrumpf.bind(this.clientApi, webSocket)
        });

        this.clientApi.addClient(webSocket).catch(({code: code, message: message}) => {
            this.handlePlayerLeft(player, code, message);
        });

        this.players.push(player);
        this.clientApi.broadcastSessionJoined(
            this.name,
            {
                id: player.id,
                name: player.name
            },
            this.players.map(function (player) {
                return {
                    id: player.id,
                    name: player.name
                };
            })
        );
    },

    addSpectator: function addSpectator(webSocket) {
        this.clientApi.addClient(webSocket);
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

        this.clientApi.broadcastTeams(createTeamsArrayForClient(this));

        this.gamePromise = new Promise((resolve, reject) => {
            this.finishGame = resolve;
            this.cancelGame = reject;
            this.started = true;

            this.gameCycle().then((winningTeam) => {
                resolve(winningTeam);
            });
        });

        return this.gamePromise;
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

    close: function close(message) {
        this.clientApi.closeAll(message);
    },

    handlePlayerLeft(player, code, message) {
        console.error('Player left. ' + code + ': ' + message);

        let team = this.teams.filter((team) => {
            return team.name !== player.team.name;
        })[0];

        this.clientApi.broadcastWinnerTeam(team);

        if (this.started) {
            this.cancelGame(team);
        } else {
            this.close(message);
            SessionHandler.removeSession(this);
        }
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
    session.isTournament = false;
    return session;
};

export default {
    create
};
