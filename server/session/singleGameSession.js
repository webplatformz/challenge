'use strict';

import * as ClientApi from '../communication/clientApi';
import * as Game from '../game/game.js';
import * as Player from '../game/player/player';
import * as Team from '../game/player/team';
import {SessionType} from '../../shared/session/sessionType';
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

function getPlayersInTeam(session, team) {
    return session.players.filter(player => player.team.name === team.name);
}

/**
 * @param chosenTeamIndex index of the team the player would like to join (optional, otherwise the next free place is assigned)
 */
function createPlayer(session, webSocket, playerName, chosenTeamIndex) {

    // Calculate team and player index (depending on chosen team or assign one)
    let teamIndex = chosenTeamIndex ? chosenTeamIndex % 2 : session.players.length % 2;
    let playersInTeam = getPlayersInTeam(session, session.teams[teamIndex]).length;
    if (playersInTeam === 2) {
        // can not assign to this team, use other team.
        teamIndex = (teamIndex === 0) ? 1 : 0;
        playersInTeam = getPlayersInTeam(session, session.teams[teamIndex]).length;
    }
    let playerId = (playersInTeam * 2) + teamIndex;

    // Adjust player's team name
    let team = session.teams[teamIndex];
    team.name = `${team.name} ${playerName}`;

    // Create player
    let player = Player.create(team, playerName, playerId, {
        dealCards: session.clientApi.dealCards.bind(session.clientApi, webSocket),
        requestTrumpf: session.clientApi.requestTrumpf.bind(session.clientApi, webSocket),
        requestCard: session.clientApi.requestCard.bind(session.clientApi, webSocket),
        rejectCard: session.clientApi.rejectCard.bind(session.clientApi, webSocket),
        rejectTrumpf: session.clientApi.rejectTrumpf.bind(session.clientApi, webSocket)
    });

    session.clientApi.addClient(webSocket).catch(({code: code, message: message}) => {
        session.handlePlayerLeft(player, code, message);
    });

    return player;
}

function insertPlayer(session, player) {
    if (player.id > session.players.length) {
        session.players.push(player);
    }
    else {
        session.players.splice(player.id, 0, player);
    }
}

/**
 * Only broadcast the session joined event for all players that have been placed in the right table position,
 * for lastPlayerJoined and players behind.
 * @param session the session to broadcast for
 * @param lastPlayerJoined the last player joined
 */
function broadcastSessionJoinedForCorrectPlacedPlayers(session, lastPlayerJoined) {
    for (let index = lastPlayerJoined.id; index < session.players.length; index++) {
        let player = session.players[index];
        // is in correct position?
        if (player.id === index) {
            broadcastSessionJoined(session, player);
        }
    }
}

function broadcastSessionJoined(session, player) {
    session.lastSessionJoin = {
        player: {
            id: player.id,
            name: player.name
        },
        playersInSession: session.players
            .filter((player, index) => player.id === index)
            .map(player => {
                return {
                    id: player.id,
                    name: player.name
                };
            })
    };
    session.clientApi.broadcastSessionJoined(
        session.name,
        session.lastSessionJoin.player,
        session.lastSessionJoin.playersInSession
    );
}

const Session = {
    maxPoints: 2500,
    startingPlayer: 0,
    type: SessionType.SINGLE_GAME,
    gamePromise: undefined,
    finishGame: undefined,
    cancelGame: undefined,
    started: false,

    /**
     * @param chosenTeamIndex index of the team the player would like to join (optional, otherwise the next free place is assigned)
     */
    addPlayer(webSocket, playerName, chosenTeamIndex) {
        const player = createPlayer(this, webSocket, playerName, chosenTeamIndex);
        insertPlayer(this, player);
        broadcastSessionJoinedForCorrectPlacedPlayers(this, player);
    },

    addSpectator: function addSpectator(webSocket) {
        this.clientApi.addClient(webSocket);
        this.clientApi.sessionJoined(webSocket, this.name, this.lastSessionJoin.player, this.lastSessionJoin.playersInSession);
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

export function create(name) {
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
}