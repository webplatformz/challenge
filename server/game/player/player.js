'use strict';

let create = function create(team, name, id, clientApi) {
    return {
        team,
        name,
        id,
        clientApi,
        cards : [],

        dealCards: function dealCards(cards) {
            this.cards = cards;
            return this.clientApi.dealCards(cards);
        },

        rejectCard: function rejectCard(card, cardsOnTable) {
            return this.clientApi.rejectCard(card, cardsOnTable);
        },

        requestCard: function requestCard(cardsOnTable) {
            return this.clientApi.requestCard(cardsOnTable);
        },

        requestTrumpf: function (isGeschoben) {
            return this.clientApi.requestTrumpf(isGeschoben);
        },

        removeCard: function removeCard(cardToRemove) {
            this.cards = this.cards.filter((card) => {
                return !card.equals(cardToRemove);
            });
        }
    };
};

module.exports = {
    create
};
