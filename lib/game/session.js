'use strict';

var Game = require('./game');

var Session = {
    maxPoints : 2500,

    init : function init() {
        var game = Object.create(Game);
        var player1= {"id": "1"};
        var player2= {"id": "2"};
        var player3= {"id": "3"};
        var player4= {"id": "4"};
        var team1= [player1, player2];
        var team2= [player3, player4];
        var teams= [team1, team2];
        
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

        });
    },

    setClientApi : function setClientApi(clientApi) {
        this.clientApi = clientApi;
    }
};


module.exports = Session;

