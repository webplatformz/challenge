'use strict';


var Deck = {
    cards : [],

    clear: function clear() {
        this.cards = [];
    },

    addCard: function addCard(card) {
        this.cards.push(card);
    },

    getCards: function getCards() {
        return this.cards;
    },

    size: function size() {
        return this.cards.length;
    },

    takeCard: function takeCard() {
        return this.cards.pop();
    }

};

module.exports = Deck;