"use strict";

let Validation = require('../validation/validation');
let stichGranter = require('./stichGranter');
let counter = require('../counter/counter');

let Cycle = {
    iterate: function () {
        let that = this;

        function handleChosenCard(player, card) {
            that.currentPlayer = player;

            if (that.validator.validate(that.playedCards, that.currentPlayer.cards, card)) {
                that.playedCards.push(card);
                that.currentPlayer.removeCard(card);
                that.clientApi.broadcastCardPlayed(that.playedCards);
            } else {
                return that.currentPlayer.rejectCard(card, that.playedCards).then(handleChosenCard);
            }

            return that.playedCards;
        }

        function broadcastAndReturnWinner(playedCards) {
            let winner = stichGranter.determineWinner(that.gameType.mode, that.gameType.trumpfColor, playedCards, that.players);
            winner.team.points += counter.count(that.gameType.mode, that.gameType.trumpfColor, playedCards);

            that.clientApi.broadcastStich(createStichMessage(winner));

            return winner;
        }

        function createStichMessage(winner) {
            return {
                name : winner.name,
                playedCards : that.playedCards,
                teams : [
                    winner.team,
                    getOtherTeam(winner.team)
                ]
            };
        }

        function getOtherTeam(team) {
            let otherTeam;
            that.players.forEach((player) => {
                if (team.name !== player.team.name) {
                    otherTeam = player.team;
                }
            });
            return otherTeam;
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

let create = function (currentPlayer, players, clientApi, gameType) {
    let cycle = Object.create(Cycle);
    cycle.currentPlayer = currentPlayer;

    rotatePlayersToCurrentPlayer(players, currentPlayer);
    cycle.players = players;
    cycle.gameType = gameType;
    cycle.clientApi = clientApi;
    cycle.validator = Validation.create(gameType.mode, gameType.trumpfColor);
    cycle.playedCards = [];
    return cycle;
};

module.exports = {
    create
};
