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

    removeLastCardPlayed: function () {
        if (this.yourTurn) {
            this.cardsInHand.splice(this.cardsInHand.indexOf(this.lastCardPlayed), 1);
            this.yourTurn = false;
        }
    }
};

let create = function create() {
    let gameState = Object.create(GameState);
    gameState.cardType = CardType.FRENCH;
    gameState.yourTurn = false;

    return gameState;
};

let CardType = {
    FRENCH: 'french',
    GERMAN: 'german'
};

module.exports = {
    create,
    CardType
};