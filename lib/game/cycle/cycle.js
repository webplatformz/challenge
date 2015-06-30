"use strict";

let Validation = require('../validation/validation');

let Cycle = {
    iterate : function () {
        let that = this;

        function logic(playerIndex, card) {
            if(that.validator.validate(that.playedCards, that.currentPlayer.cards, card)) {
                that.playedCards.push(card);
                let cardIndex = that.currentPlayer.cards.indexOf(card);
                that.currentPlayer.cards.splice(cardIndex, 1);
                that.clientApi.broadcastCardPlayed(that.playedCards);

                that.turnIndex++;
                that.currentPlayer = that.players[playerIndex];
            } else {
                return that.currentPlayer.rejectCard().then(logic);
            }
            return that.playedCards;
        }

        function doIteration() {
            return that.players.reduce((previousPromise, currentPlayer, index) => {
                if (index === 1) {
                    previousPromise = previousPromise.requestCard([]).then(logic.bind(null, index));
                }

                return previousPromise.then((cardsOnTable) => {
                    return currentPlayer.requestCard(cardsOnTable).then(logic.bind(null, index));
                });
            });
        }

        //let doIteration = function doIteration() {
        //    return that.currentPlayer.requestCard()
        //        .then((card) => {
        //            console.log('got a new card');
        //            if(that.validator.validate(that.playedCards, that.currentPlayer.cards, card)) {
        //                that.playedCards.push(card);
        //                let cardIndex = that.currentPlayer.cards.indexOf(card);
        //                that.currentPlayer.cards.splice(cardIndex, 1);
        //                that.clientApi.broadcastCardPlayed(that.playedCards);
        //
        //                that.turnIndex++;
        //
        //                var currentIndex = that.players.indexOf(that.currentPlayer);
        //
        //                that.currentPlayer = that.players[(currentIndex + 1) % 4];
        //                if(that.turnIndex < 4) {
        //                    console.log('iterating again');
        //                    return doIteration();
        //                } else {
        //                    return that.playedCards;
        //                }
        //            } else {
        //                that.currentPlayer.rejectCard();
        //            }
        //        });
        //};

        return doIteration();

    }
};

let create = function (currentPlayer, players, clientApi, cycleFinishedCallback) {
    let cycle = Object.create(Cycle);
    cycle.players = players;
    cycle.clientApi = clientApi;
    cycle.validator = Validation.create(); // TODO use real validator
    cycle.playedCards = [];
    cycle.currentPlayer = currentPlayer;
    cycle.turnIndex = 0;
    cycle.cycleFinishedCallback = cycleFinishedCallback;
    return cycle;
};

module.exports = {
    create
};
