'use strict';

let Deck    = require('./deck/deck');
let Trick   = require('./trick/trick');

let Game = {

    init : function init(teams, maxPoints) {
        let deck = Object.create(Deck);
        this.teams = teams;
        this.maxPoints = maxPoints;
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