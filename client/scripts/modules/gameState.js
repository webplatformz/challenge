'use strict';

function compareCards(card1, card2) {
    if (card1.color < card2.color) {
        return -1;
    }
    if (card1.color > card2.color) {
        return 1;
    }

    return card1.number - card2.number;
}

let GameState = {

    setCardsInHand: function (cardsInHand) {
        this.cardsInHand = cardsInHand.sort(compareCards);
    },

    removeCard: function (card) {
        this.cardsInHand.splice(this.cardsInHand.indexOf(card), 1);
    }
};

let create = function create() {
    return Object.create(GameState);
}


module.exports = {
    create
};