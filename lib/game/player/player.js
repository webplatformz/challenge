'use strict';

let create = function create(team, name, clientApi) {
    return {
        team,
        name,
        clientApi,

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
};

module.exports = {
    create
};
