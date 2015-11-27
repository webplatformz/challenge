'use strict';

let Player = {
    dealCards (cards) {
        this.cards = cards;
        return this.clientApi.dealCards(cards);
    },

    rejectCard (card, cardsOnTable) {
        return this.clientApi.rejectCard(card, cardsOnTable);
    },

    requestCard (cardsOnTable) {
        return this.clientApi.requestCard(cardsOnTable);
    },

    requestTrumpf (isGeschoben) {
        return this.clientApi.requestTrumpf(isGeschoben);
    },

    rejectTrumpf (gameType) {
        return this.clientApi.rejectTrumpf(gameType);
    },

    removeCard (cardToRemove) {
        this.cards = this.cards.filter((card) => {
            return !card.equals(cardToRemove);
        });
    }
};

export default {
    create (team, name, id, clientApi) {
        let player = Object.create(Player);
        player.id = id;
        player.name = name;
        player.team = team;
        player.clientApi = clientApi;
        return player;
    }
};
