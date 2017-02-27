import * as ClientApi from '../communication/clientApi';
import { SessionType } from '../../shared/session/sessionType';
import * as Ranking from '../game/ranking/ranking';
import * as RankingTable from './rankingTable';
import * as SingleGameSession from './singleGameSession';
import * as _ from 'lodash';
import nameGenerator from 'docker-namesgenerator';

const clientRequestTimeoutInMillis = 500;

function getPairingsPerRound(players) {
    return _.flatMap(players, (player, index) => {
        return players.filter((secondPlayer, secondIndex) => {
            return secondIndex > index;
        }).map((secondPlayer) => {
            return {
                player1: player,
                player2: secondPlayer
            };
        });
    });
}

function createSessionWithPlayers({ player1, player2 }) {
    let session = SingleGameSession.create(nameGenerator(), clientRequestTimeoutInMillis);

    session.addPlayer(player1.clients[0], player1.playerName);
    session.addPlayer(player2.clients[0], player2.playerName);
    session.addPlayer(player1.clients[1], player1.playerName);
    session.addPlayer(player2.clients[1], player2.playerName);

    player1.isPlaying = true;
    player2.isPlaying = true;

    return session;
}

function createResultObject(winnerName, { player1, player2 }) {
    if (winnerName.indexOf(player1.playerName) > -1) {
        return { winner: player1.playerName, loser: player2.playerName };
    }

    return { winner: player2.playerName, loser: player1.playerName };
}

const TournamentSession = {
    type: SessionType.TOURNAMENT,
    started: false,
    rounds: process.env.TOURNAMENT_ROUNDS || 1,
    gamesToPlay: 0,
    gamesPlayed: 0,

    calculateGameCount() {
        let playerCount = this.players.length;
        let gamesPerRound = playerCount / 2 * (playerCount - 1);

        return this.rounds * gamesPerRound;
    },

    handleLeavingClient(playerName, webSocket) {
        const player = this.getPlayer(playerName);

        if (player) {
            if (this.started) {
                player.isPlaying = false;
                player.connected = false;
                player.clients.forEach((actClient) => {
                    this.clientApi.removeClient(actClient, 'One of the clients of player ' + playerName + ' disconnected');
                });
            } else {
                player.clients = player.clients.filter(actWebSocket => actWebSocket !== webSocket);
                this.rankingTable.removePlayer(playerName);

                if (player.clients.length === 0) {
                    this.players = this.players.filter(actPlayer => actPlayer !== player);
                }

            }
            this.clientApi.broadcastTournamentRankingTable(this.rankingTable);
        }
    },

    addPlayer(webSocket, playerName) {
        this.clientApi.addClient(webSocket).catch(() => this.handleLeavingClient(playerName, webSocket));

        let player = this.getPlayer(playerName);

        if (player) {
            if (player.clients.length < 2) {
                player.clients.push(webSocket);
            } else {
                this.clientApi.removeClient(webSocket, 'This Player already has two registered clients!');
                return;
            }
        } else {
            this.players.push({
                playerName,
                isPlaying: false,
                connected: true,
                clients: [
                    webSocket
                ]
            });
        }

        this.rankingTable.addPlayer(playerName);
        this.clientApi.broadcastTournamentRankingTable(this.rankingTable);
    },

    getPlayer(playerName) {
        return this.players.find((actPlayer) => {
            return actPlayer.playerName === playerName;
        });
    },

    addSpectator(webSocket) {
        this.clientApi.addClient(webSocket);
        this.clientApi.sendTournamentRankingTable(webSocket, this.rankingTable);
        this.spectators.push(webSocket);
    },

    isComplete() {
        return this.players.every(player => player.clients.length === 2);
    },

    start() {
        this.started = true;
        this.clientApi.broadcastTournamentStarted();
        this.gamesToPlay = this.calculateGameCount();

        this.players.forEach(element => this.ranking.addPlayer(element.playerName));

        let pairings = getPairingsPerRound(this.players);
        for (let i = 0; i < this.rounds; i++) {
            this.pairings = this.pairings.concat(pairings);
        }

        return this.startPairingSessions()
            .then(() => {
                this.ranking.updateRatings();
                this.ranking.players.forEach(ranking => {
                    this.rankingTable.updatePlayerRating(ranking.name, ranking.player.getRating());
                });
                this.rankingTable.updateAndSortRanking();
                this.clientApi.broadcastTournamentRankingTable(this.rankingTable);
            });
    },

    rankPairing(pairing, result) {
        let { player1, player2 } = pairing;

        this.pairings.splice(this.pairings.findIndex(actPairing => actPairing === pairing), 1);
        this.ranking.updateMatchResult(result);
        this.rankingTable.addPairingResult(player1.playerName, player2.playerName, result.winner === player1.playerName);
        this.clientApi.broadcastTournamentRankingTable(this.rankingTable);
    },

    handleSessionFinish(pairing, winningTeam) {
        let { player1, player2 } = pairing;
        let result = createResultObject(winningTeam.name, pairing);

        player1.isPlaying = false;
        player2.isPlaying = false;

        this.rankPairing(pairing, result);

        return Promise.resolve();
    },

    handlePairingWithDisconnectedClients(pairing) {
        let { player1 } = pairing;

        if (player1.connected) {
            this.rankPairing(pairing, createResultObject(player1.playerName, pairing));
        } else {
            this.rankPairing(pairing, createResultObject(pairing.player2.playerName, pairing));
        }

        return Promise.resolve();
    },

    startPairingSessions() {
        return new Promise(resolve => {
            this.pairings.forEach(pairing => {
                let { player1, player2 } = pairing;

                if (!player1.isPlaying && !player2.isPlaying) {
                    let sessionPromise;

                    if (!player1.connected || !player2.connected) {
                        sessionPromise = this.handlePairingWithDisconnectedClients(pairing);
                    } else {
                        sessionPromise = createSessionWithPlayers(pairing).start()
                            .then(this.handleSessionFinish.bind(this, pairing), this.handleSessionFinish.bind(this, pairing));
                    }

                    sessionPromise.then(() => {
                        if (++this.gamesPlayed === this.gamesToPlay) {
                            resolve();
                        } else {
                            this.startPairingSessions().then(() => resolve());
                        }
                    });
                }
            });
        });
    },

    close(message) {
        this.clientApi.closeAll(message);
    }
};

export function create(sessionName) {
    let session = Object.create(TournamentSession);
    session.name = sessionName;
    session.players = [];
    session.spectators = [];
    session.clientApi = ClientApi.create(clientRequestTimeoutInMillis);
    session.pairings = [];
    session.ranking = Ranking.create();
    session.rankingTable = RankingTable.create();
    session.isTournament = true;
    return session;
}