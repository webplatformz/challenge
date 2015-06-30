'use strict';

let Player = {
    dealCards: function dealCards(cards) {
        this.cards = cards;
        return this.clientApi.dealCards(cards);
    },

    rejectCard: function rejectCard() {
        // TODO
    },

    requestCard: function requestCard() {
        return this.clientApi.requestCard();
    },

    requestTrumpf: function (isGeschoben, callback) {
        return this.clientApi.requestTrumpf(isGeschoben);
    }
};

let create = function create(team, name, clientApi) {
    let player = Object.create(Player);
    player.team = team;
    player.name = name;
    player.clientApi = clientApi;
    return player;
};

module.exports = {
    create
};
