'use strict';

var Deck    = require('./deck/deck');
var Trick   = require('./trick/trick');

var Game = {

    init : function init(teams, maxPoints) {
        var deck = Object.create(Deck);
        this.teams = teams;
        this.maxPoints = maxPoints;
        this.cards = deck.getShuffledCards();
    },

    /**
     *
     * @param color enum Color
     */
    chooseTrump: function chooseTrump(color) {

    },
    pushTrumpChoice : function pushTrumpChoice() {
        // request trump with the other player in team, isPushed =false
    }
};

module.exports = Game;