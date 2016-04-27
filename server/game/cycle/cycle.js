"use strict";

import Validation from '../validation/validation.js';
import stichGranter from './stichGranter.js';
import * as Counter from '../counter/counter.js';

const Cycle = {
    iterate: function () {
        let that = this;

        function handleChosenCard(player, card) {
            that.currentPlayer = player;

            if (that.validator.validate(that.playedCards, that.currentPlayer.cards, card)) {
                that.playedCards.push(card);
                that.currentPlayer.removeCard(card);
                that.clientApi.broadcastCardPlayed(that.playedCards);
            } else {
                that.currentPlayer.rejectCard(card, that.playedCards);

                return that.currentPlayer.requestCard(that.playedCards)
                    .then(handleChosenCard.bind(null, player));
            }

            return that.playedCards;
        }

        function broadcastAndReturnWinner(playedCards) {
            let winner = stichGranter.determineWinner(that.gameType.mode, that.gameType.trumpfColor, playedCards, that.players);
            let winnerTeam = winner.team;
            let looserTeam = that.players.filter((player) => {
                return player.team !== winner.team;
            })[0].team;
            let actPoints = Counter.count(that.gameType.mode, that.gameType.trumpfColor, playedCards);

            winnerTeam.points += actPoints;
            winnerTeam.currentRoundPoints += actPoints;

            if (winner.cards.length === 0) {
                let lastStichPoints = Counter.calculateLastStichValue(that.gameType.mode, that.gameType.trumpfColor);
                winnerTeam.points += lastStichPoints;
                winnerTeam.currentRoundPoints += lastStichPoints;

                if (looserTeam.currentRoundPoints === 0) {
                    var matchPoints = Counter.calculateMatchValues(that.gameType.mode, that.gameType.trumpfColor);
                    winnerTeam.points += matchPoints;
                    winnerTeam.currentRoundPoints += matchPoints;
                }

                that.clientApi.broadcastStich(createStichMessage(winner));
                that.clientApi.broadcastGameFinished([winnerTeam, looserTeam]);
                winnerTeam.currentRoundPoints = 0;
                looserTeam.currentRoundPoints = 0;
            } else {
                that.clientApi.broadcastStich(createStichMessage(winner));
            }

            return winner;
        }

        function createStichMessage(winner) {
            return {
                name: winner.name,
                id: winner.id,
                playedCards: that.playedCards,
                teams: [
                    winner.team,
                    getOtherTeam(winner.team)
                ]
            };
        }

        function getOtherTeam(team) {
            for (var i = 0; i < that.players.length; i++) {
                if (that.players[i].team.name !== team.name) {
                    return that.players[i].team;
                }
            }
        }

        return that.players.reduce((previousPlayer, currentPlayer, index) => {
            let previousPromise;

            if (index === 1) {
                previousPromise = previousPlayer.requestCard(that.playedCards).then(handleChosenCard.bind(null, previousPlayer));
            } else {
                previousPromise = previousPlayer;
            }

            return previousPromise.then((cardsOnTable) => {
                return currentPlayer.requestCard(cardsOnTable).then(handleChosenCard.bind(null, currentPlayer));
            });
        }).then(broadcastAndReturnWinner);
    }
};

function rotatePlayersToCurrentPlayer(players, currentPlayer) {
    for (; players[0] !== currentPlayer;) {
        players.push(players.shift());
    }
}

export function create(currentPlayer, players, clientApi, gameType) {
    let cycle = Object.create(Cycle);
    cycle.currentPlayer = currentPlayer;

    rotatePlayersToCurrentPlayer(players, currentPlayer);
    cycle.players = players;
    cycle.gameType = gameType;
    cycle.clientApi = clientApi;
    cycle.validator = Validation.create(gameType.mode, gameType.trumpfColor);
    cycle.playedCards = [];
    return cycle;
}
