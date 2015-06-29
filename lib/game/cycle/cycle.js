"use strict";

let Validation = require('../../../lib/game/validation/Validation');


let Cycle = {
    iterate : function () {
        let currentPlayer = this.players[this.currentPlayerIndex];
        let card = currentPlayer.requestCard();
        if(this.validator.validate(this.playedCards, currentPlayer.cards, card)) {
            this.playedCards.push(card);
            this.clientApi.broadcastCardPlayed(this.playedCards);

            this.turnIndex++;
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
            if(this.turnIndex < 4) {
                this.iterate();
            } else {
                this.cycleFinishedCallback(this.playedCards);
            }
        } else {
            currentPlayer.rejectCard();
        }
    }
};

let create = function (currentPlayerIndex, players, round, clientApi, cycleFinishedCallback) {
    let cycle = Object.create(Cycle);
    cycle.players = players;
    cycle.round = round;
    cycle.clientApi = clientApi;
    cycle.validator = Validation.create(); // TODO use real validator
    cycle.playedCards = [];
    cycle.currentPlayerIndex = currentPlayerIndex;
    cycle.turnIndex = 0;
    cycle.cycleFinishedCallback = cycleFinishedCallback;
    return cycle;
};

module.exports = {
    create
};
