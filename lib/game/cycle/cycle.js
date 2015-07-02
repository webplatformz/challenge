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
                let cardIndex = that.currentPlayer.cards.indexOf(card);
                that.currentPlayer.cards.splice(cardIndex, 1);
                that.clientApi.broadcastCardPlayed(that.playedCards);

                if (that.playedCards.length === 4) {
                    let winner = stichGranter.determineWinner(that.gameType.mode, that.gameType.trumpfColor, that.playedCards, that.players);
                    let points = counter.count(that.gameType.mode, that.gameType.trumpfColor, that.playedCards);
                    winner.team.points += points;
                }

            } else {
                return that.currentPlayer.rejectCard(card, that.playedCards).then(handleChosenCard);
            }

            return that.playedCards;
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
        });
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
    cycle.validator = Validation.create();
    cycle.playedCards = [];
    return cycle;
};

module.exports = {
    create
};
