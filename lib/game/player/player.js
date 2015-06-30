'use strict';

let create = function create(team, name, clientApi) {
    return {
        team,
        name,
        clientApi,

        rejectCard : function rejectCard() {
            // TODO
        },

        requestCard : function requestCard() {
            // TODO return card
        },

        requestTrumpf : function (isGeschoben, callback) {
            return this.clientApi.requestTrumpf(isGeschoben);
        },

        receiveCards : function receiveCards(cards) {
            this.cards = cards;
        }
    };
};

module.exports = {
    create
};
