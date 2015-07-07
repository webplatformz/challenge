'use strict';

let Player = {
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

    rejectTrumpf: function (gameType) {
        return this.clientApi.rejectTrumpf(gameType);
    },

    removeCard: function removeCard(cardToRemove) {
        this.cards = this.cards.filter((card) => {
            return !card.equals(cardToRemove);
        });
    }
};

let create = function create(team, name, id, clientApi) {
    let player = Object.create(Player);
    player.id = id;
    player.name = name;
    player.team = team;
    player.clientApi = clientApi;
    return player;
};

module.exports = {
    create
};
