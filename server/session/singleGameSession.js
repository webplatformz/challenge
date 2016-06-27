'use strict';

import * as ClientApi from '../communication/clientApi';
import * as Game from '../game/game.js';
import * as Player from '../game/player/player';
import * as Team from '../game/player/team';
import {SessionType} from '../../shared/session/sessionType';
import SessionHandler from './sessionHandler';
import {MessageType} from '../../shared/messages/messageType';
import {startRandomBot} from "../bot/botStarter";

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

function getFirstAvailableTeamIndex(session) {
    const firstFreePlayerIndex = session.players.findIndex((player, index) => player.id !== index);
    if (firstFreePlayerIndex !== -1) {
        return firstFreePlayerIndex % 2;
    }
    else {
        return session.players.length % 2;
    }
}

function assignTeamIndex(session, chosenTeamIndex = getFirstAvailableTeamIndex(session)) {
    let teamIndex = chosenTeamIndex;
    let playersInTeam = getPlayersInTeam(session, session.teams[teamIndex]).length;
    if (playersInTeam === 2) {
        // can not assign to this team, use other team.
        teamIndex = (teamIndex === 0) ? 1 : 0;
    }
    return teamIndex;
}

/**
 * @param chosenTeamIndex index of the team the player would like to join (optional, otherwise the next free place is assigned)
 */
function createPlayer(session, webSocket, playerName, chosenTeamIndex) {

    // Calculate team and player index (depending on chosen team or assign one)
    const teamIndex = assignTeamIndex(session, chosenTeamIndex);
    const playersInTeam = getPlayersInTeam(session, session.teams[teamIndex]).length;
    const playerId = (playersInTeam * 2) + teamIndex;

    // Adjust player's team name
    let team = session.teams[teamIndex];
    team.name = `${team.name} ${playerName}`;

    // Create player
    return Player.create(team, playerName, playerId, {
        dealCards: session.clientApi.dealCards.bind(session.clientApi, webSocket),
        requestTrumpf: session.clientApi.requestTrumpf.bind(session.clientApi, webSocket),
        requestCard: session.clientApi.requestCard.bind(session.clientApi, webSocket),
        rejectCard: session.clientApi.rejectCard.bind(session.clientApi, webSocket),
        rejectTrumpf: session.clientApi.rejectTrumpf.bind(session.clientApi, webSocket)
    });
}

function insertPlayer(session, player) {
    if (player.id > session.players.length) {
        session.players.push(player);
    }
    else {
        session.players.splice(player.id, 0, player);
    }
}

function registerPlayerAsClient(session, webSocket, player) {
    session.clientApi.addClient(webSocket).catch(({code: code, message: message}) => {
        session.handlePlayerLeft(player, code, message);
    });
}

/**
 * Only broadcast the session joined event for all players that have been placed in the right table position,
 * for lastPlayerJoined and players behind.
 * @param session the session to broadcast for
 * @param lastPlayerJoined the last player joined
 */
function registerClientAndBroadcastSessionJoinedForCorrectPlacedPlayers(session, webSocket, lastPlayerJoined) {

    // Prepare player registration finalization (tobe called later, when player is placed on table)
    session.finalizeRegistrationForPlayerFunctions[lastPlayerJoined.id] = () => registerClientAndBroadcastSessionJoined(session, webSocket, lastPlayerJoined);

    // Finalize registration for all players that have been placed now correctly.
    for (let index = lastPlayerJoined.id; index < session.players.length; index++) {
        let player = session.players[index];
        // is in correct position?
        if (player.id === index) {
            session.finalizeRegistrationForPlayerFunctions[index]();
        }
    }
}

function registerClientAndBroadcastSessionJoined(session, webSocket, playerJoined) {

    registerPlayerAsClient(session, webSocket, playerJoined);

    session.lastSessionJoin = {
        player: {
            id: playerJoined.id,
            name: playerJoined.name
        },
        playersInSession: session.players
            .filter((player, index) => index <= playerJoined.id)
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
        registerClientAndBroadcastSessionJoinedForCorrectPlacedPlayers(this, webSocket, player);

        this.joinBotListeners.push(this.clientApi.subscribeMessage(webSocket, MessageType.JOIN_BOT, (message) => {
            message.data.url = `ws://localhost:${process.env.PORT || 3000}`;
            startRandomBot(message.data);
        }));
    },

    addSpectator(webSocket) {
        this.clientApi.addClient(webSocket);
        this.clientApi.sessionJoined(webSocket, this.name, this.lastSessionJoin.player, this.lastSessionJoin.playersInSession);
    },

    isComplete() {
        return this.players.length === 4;
    },

    getNextStartingPlayer() {
        return this.startingPlayer++ % 4;
    },

    start() {
        if (!this.isComplete()) {
            throw 'Not enough players to start game!';
        }

        this.joinBotListeners.forEach(joinBotListener => joinBotListener());

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

    gameCycle(nextStartingPlayer = this.getNextStartingPlayer()) {
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

    close(message) {
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
    session.finalizeRegistrationForPlayerFunctions = {};
    session.joinBotListeners = [];
    return session;
}