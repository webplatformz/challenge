'use strict';

var Card = require('./card');
var CardType = require('./card');

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

var Deck = {
    cards: [],

    init: function init() {
        this.cards = [];
        var cardNumber = 6;
        while (cardNumber < 15) {
            this.cards.push(new Card.Card(cardNumber, CardType.HEARTS));
            this.cards.push(new Card.Card(cardNumber, CardType.DIAMONDS));
            this.cards.push(new Card.Card(cardNumber, CardType.CLUBS));
            this.cards.push(new Card.Card(cardNumber, CardType.SPADES));
            cardNumber++;
        }
        return( this );
    },

    shuffleCards: function shuffleCards() {
        return shuffle(this.cards);
    },

    clear: function clear() {
        this.cards = [];
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
