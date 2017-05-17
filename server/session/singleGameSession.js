import * as ClientApi from '../communication/clientApi';
import * as Game from '../game/game';
import * as Player from '../game/player/player';
import * as Team from '../game/player/team';
import { SessionType } from '../../shared/session/sessionType';
import SessionHandler from './sessionHandler';
import { MessageType } from '../../shared/messages/messageType';
import { startRandomBot } from '../bot/botStarter';
import { Logger } from '../logger';
import EnvironmentUtil from '../registry/environmentUtil';
import * as JsonResultProxy from '../communication/jsonResultProxy';

const tournamentLogging = Boolean(process.env.TOURNAMENT_LOGGING);

function createTeamsArrayForClient(session) {
    return session.teams.map((team) => {
        return {
            name: team.name,
            players: session.players.filter((player) => {
                return player.team.name === team.name;
            }).map((player) => {
                return {
                    name: player.name,
                    id: player.id,
                    seatId: player.seatId
                };
            })
        };
    });
}

function getPlayersInTeam(session, team) {
    return session.players.filter(player => player.team.name === team.name);
}

function getFirstAvailableTeamIndex(session) {
    const firstFreePlayerIndex = session.players.findIndex((player, index) => player.seatId !== index);
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
    const seatId = (playersInTeam * 2) + teamIndex;
    const playerId = generateUuid();
    webSocket.jassChallengeId = `${playerName}#${seatId}`;

    return Player.create(session.teams[teamIndex], playerName, playerId, seatId, {
        dealCards: session.clientApi.dealCards.bind(session.clientApi, webSocket),
        requestTrumpf: session.clientApi.requestTrumpf.bind(session.clientApi, webSocket),
        requestCard: session.clientApi.requestCard.bind(session.clientApi, webSocket),
        rejectCard: session.clientApi.rejectCard.bind(session.clientApi, webSocket),
        rejectTrumpf: session.clientApi.rejectTrumpf.bind(session.clientApi, webSocket)
    });
}

// from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateUuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function insertPlayer(session, player) {
    if (player.seatId > session.players.length) {
        session.players.push(player);
    } else {
        session.players.splice(player.seatId, 0, player);
    }
}

function registerPlayerAsClient(session, webSocket, player) {
    session.clientApi.addClient(webSocket).catch(({ code: code, message: message }) => {
        session.handlePlayerLeft(player, code, message);
    });
}

function registerClientAndBroadcastSessionJoined(session, webSocket, playerJoined) {

    registerPlayerAsClient(session, webSocket, playerJoined);

    session.lastSessionJoin = {
        player: {
            id: playerJoined.id,
            seatId: playerJoined.seatId,
            name: playerJoined.name
        },
        playersInSession: session.players
            .map(player => {
                return {
                    id: player.id,
                    seatId: player.seatId,
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
    finishGame: undefined,
    started: false,
    finished: false,

    /**
     * @param chosenTeamIndex index of the team the player would like to join (optional, otherwise the next free place is assigned)
     */
    addPlayer(webSocket, playerName, chosenTeamIndex) {
        const player = createPlayer(this, webSocket, playerName, chosenTeamIndex);
        insertPlayer(this, player);
        registerClientAndBroadcastSessionJoined(this, webSocket, player);

        this.joinBotListeners.push(this.clientApi.subscribeMessage(webSocket, MessageType.JOIN_BOT, (message) => {
            message.data.url = `ws://localhost:${EnvironmentUtil.getPort()}`;
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

        let resultProxy;
        if (tournamentLogging) {
            resultProxy = JsonResultProxy.create(`${this.players[0].name} vs ${this.players[1].name}.${Date.now()}`);
            this.clientApi.setCommunicationProxy(resultProxy);
        }
        this.clientApi.broadcastTeams(createTeamsArrayForClient(this));

        return new Promise((resolve) => {
            this.started = true;
            this.finishGame = winningTeam => {
                this.started = false;
                this.finished = true;
                this.clientApi.broadcastWinnerTeam(winningTeam);
                resolve(winningTeam);
            };

            this.gameCycle()
                .then((winningTeam) => {
                    this.finishGame(winningTeam);

                    if (tournamentLogging) {
                        resultProxy.destroy();
                    }
                })
                .catch(error => {
                    if (error && error.data) {
                        const failingPlayer = error.data;
                        Logger.error(`Player ${failingPlayer.name}: ${error.message}`);
                        const winningTeam = this.teams.find(team => team.name !== failingPlayer.team.name);
                        this.finishGame(winningTeam);
                    } else {
                        Logger.error(error);
                        const winningTeam = this.teams[0].points >= this.teams[1].points ? this.teams[0] : this.teams[1];
                        this.finishGame(winningTeam);
                    }

                    if (tournamentLogging) {
                        resultProxy.destroy();
                    }
                });
        });
    },

    gameCycle(nextStartingPlayer = this.getNextStartingPlayer()) {
        let players = this.players.slice();
        let game = Game.create(players, this.maxPoints, this.players[nextStartingPlayer], this.clientApi);

        return game.start().then(() => {
            let pointsTeamA = this.teams[0].points;
            let pointsTeamB = this.teams[1].points;

            if (pointsTeamA > pointsTeamB && pointsTeamA >= this.maxPoints) {
                return this.teams[0];
            }

            if (pointsTeamB > pointsTeamA && pointsTeamB >= this.maxPoints) {
                return this.teams[1];
            }

            return this.gameCycle(this.getNextStartingPlayer());
        });
    },

    close(message) {
        this.clientApi.closeAll(message);
    },

    handlePlayerLeft(player, code, message) {
        if (!this.finished) {
            const messageToPrint = message || 'No Message given';

            Logger.error(`Player ${player.name} left with reason: ${code}|${messageToPrint}`);
            this.clientApi.broadcastPlayerLeft(player.name);

            const team = this.teams.filter(team => team.name !== player.team.name)[0];

            if (this.started) {
                this.finishGame(team);
            } else {
                this.close(message);
                SessionHandler.removeSession(this);
            }
        }
    },

    dispose() {
        this.clientApi.dispose();
    }
};

export function create(name, timeoutInMillis) {
    let session = Object.create(Session);
    session.players = [];
    session.name = name;
    session.teams = [
        Team.create('Team 1'),
        Team.create('Team 2')
    ];
    session.clientApi = ClientApi.create(timeoutInMillis);
    session.isTournament = false;
    session.finalizeRegistrationForPlayerFunctions = {};
    session.joinBotListeners = [];
    return session;
}
