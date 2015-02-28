'use strict';

var _ = require('underscore');
var Card = require('./card');
var CardType = require('./card');

var Deck = {
    cards: [],

    init: function init() {
        this.cards = [];
        var cardNumber = 6;
        while (cardNumber < 15) {
            this.cards.push(new Card.Card(cardNumber, Card.CardType.HEARTS));
            this.cards.push(new Card.Card(cardNumber, Card.CardType.DIAMONDS));
            this.cards.push(new Card.Card(cardNumber, Card.CardType.CLUBS));
            this.cards.push(new Card.Card(cardNumber, Card.CardType.SPADES));
            cardNumber++;
        }
        return( this );
    },

    shuffleCards: function shuffleCards() {
        return _.shuffle(this.cards);
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
