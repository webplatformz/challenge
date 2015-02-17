'use strict';

var Game = require('./game');

var Session = {
    maxPoints : 2500,

    init : function init() {
        var game = Object.create(Game);
        game.init(teams, this.maxPoints, {
            /**
             *
             * @param playerId String
             * @param cards array of Cards
             */
            dealCards : function dealCards(playerId, cards) {
                // durchlauferhitzer
            },
            /**
             *
             * @param isPushed boolean
             */
            requestTrump : function requestTrump(isPushed) {
                // durchlauferhitzer
            },
            gameFinished : function gameFinished() {
                // teams object ist bereits aktualisiert
                // neues game bauen / ganz fertig
            },
            sessionFinished : function sessionFinished() {
                // spiel vorzeitig fertig
            }

        })
    },

    setClientApi : function setClientApi(clientApi) {
        this.clientApi = clientApi;
    }
};


module.exports = Session;

