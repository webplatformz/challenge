"use strict";

let Validation = require('../validation/validation');

let Cycle = {
    iterate : function () {
        let card = this.currentPlayer.requestCard();
        if(this.validator.validate(this.playedCards, this.currentPlayer.cards, card)) {
            this.playedCards.push(card);
            let cardIndex = this.currentPlayer.cards.indexOf(card);
            this.currentPlayer.cards.splice(cardIndex, 1);
            this.clientApi.broadcastCardPlayed(this.playedCards);

            this.turnIndex++;

            var currentIndex = this.players.indexOf(this.currentPlayer);

            this.currentPlayer = this.players[(currentIndex + 1) % 4];
            if(this.turnIndex < 4) {
                this.iterate();
            } else {
                this.cycleFinishedCallback(this.playedCards);
            }
        } else {
            this.currentPlayer.rejectCard();
        }
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
