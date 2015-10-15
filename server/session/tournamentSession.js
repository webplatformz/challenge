'use strict';

import ClientApi from '../communication/clientApi.js';
import SessionType from '../../shared/session/sessionType.js';
import CloseEventCode from '../communication/closeEventCode.js';
import Ranking from '../game/ranking/ranking.js';
import RankingTable from './rankingTable.js';
import SingleGameSession from './singleGameSession.js';
import {polyfill} from 'babel';
import _ from 'lodash';
import UUID from 'uuid';

function getPairingsPerRound(players) {
    return _.flatten(players.map((player, index) => {
        return players.filter((secondPlayer, secondIndex) => {
            return secondIndex > index;
        }).map((secondPlayer) => {
            return {
                player1: player,
                player2: secondPlayer
            };
        });
    }));
}

function createSessionWithPlayers({player1, player2}) {
    let session = SingleGameSession.create(UUID.v4());

    session.addPlayer(player1.clients[0], player1.playerName);
    session.addPlayer(player2.clients[0], player2.playerName);
    session.addPlayer(player1.clients[1], player1.playerName);
    session.addPlayer(player2.clients[1], player2.playerName);

    player1.isPlaying = true;
    player2.isPlaying = true;

    return session;
}

function createResultObject(winningTeam, {player1, player2}) {
    if (winningTeam.name.indexOf(player1.playerName) > -1) {
        return {winner: player1.playerName, loser: player2.playerName};
    }

    return {winner: player2.playerName, loser: player1.playerName};
}

let TournamentSession = {
    type: SessionType.TOURNAMENT,
    started: false,
    rounds: 1,
    gamesToPlay: 0,
    gamesPlayed: 0,

    calculateGameCount() {
        let playerCount = this.players.length;
        let gamesPerRound = playerCount / 2 * (playerCount - 1);

        return this.rounds * gamesPerRound;
    },

    handleLeavingClient(playerName) {
        let player = this.getPlayer(playerName);

        player.isPlaying = false;
        player.connected = false;
        player.clients.forEach((actClient) => {
            this.clientApi.removeClient(actClient, CloseEventCode.ABNORMAL, 'One of the clients of player ' + playerName + ' disconnected');
        });
    },

    addPlayer(webSocket, playerName) {
        this.clientApi.addClient(webSocket).catch(this.handleLeavingClient.bind(this, playerName));

        let player = this.getPlayer(playerName);

        if (player) {
            if (player.clients.length < 2) {
                player.clients.push(webSocket);
            } else {
                this.clientApi.removeClient(webSocket, CloseEventCode.ABNORMAL, 'This Player already has two registered clients!');
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

        return this.startPairingSessions().then(() => {
            this.ranking.updateRatings();
            this.ranking.players.forEach(ranking => {
                this.rankingTable.updateRating(ranking.name, ranking.player.getRating());
            });

            this.clientApi.broadcastTournamentRankingTable(this.rankingTable);
        });
    },

    rankPairing(pairing, result) {
        let {player1, player2} = pairing;

        _.remove(this.pairings, pairing);
        this.ranking.updateMatchResult(result);
        this.rankingTable.addPairingResult(player1.playerName, player2.playerName, result.winner === player1.playerName);
        this.clientApi.broadcastTournamentRankingTable(this.rankingTable);
    },

    handleSessionFinish(pairing, winningTeam) {
        let {player1, player2} = pairing;
        let result = createResultObject(winningTeam, pairing);

        player1.isPlaying = false;
        player2.isPlaying = false;

        this.rankPairing(pairing, result);

        return Promise.resolve();
    },

    handlePairingWithDisconnectedClients(pairing) {
        let {player1, player2} = pairing;

        if (player1.connected) {
            this.rankPairing(pairing, {winner: player1, loser: player2});
        } else {
            this.rankPairing(pairing, {winner: player2, loser: player1});
        }
    },

    startPairingSessions() {
        return new Promise(resolve => {
            this.pairings.forEach(pairing => {
                let {player1, player2} = pairing;

                if (!player1.isPlaying && !player2.isPlaying) {
                    if (!player1.connected || !player2.connected) {
                        this.handlePairingWithDisconnectedClients(pairing);
                    } else {
                        let session = createSessionWithPlayers(pairing);

                        session.start()
                            .then(this.handleSessionFinish.bind(this, pairing), this.handleSessionFinish.bind(this, pairing))
                            .then(() => {
                                if (++this.gamesPlayed === this.gamesToPlay) {
                                    resolve();
                                } else {
                                    this.startPairingSessions().then(() => resolve());
                                }
                            });
                    }
                }
            });
        });
    },

    close(code, message) {
        this.clientApi.closeAll(code, message);
    }
};

export default {
    create(sessionName) {
        let session = Object.create(TournamentSession);
        session.name = sessionName;
        session.players = [];
        session.spectators = [];
        session.clientApi = ClientApi.create();
        session.pairings = [];
        session.ranking = Ranking.create();
        session.rankingTable = RankingTable.create();
        session.isTournament = true;
        return session;
    }
};
