'use strict';

var Game = require('./game');

var Session = {
    maxPoints : 2500,
    teams : [],       
    init : function init(){
        this.teams = [];
        return( this ); 
    },
    addPlayer: function addPlayer(playerId){
        var player= {"id": playerId};
        if (this.teams.length === 0 || (this.teams.length === 1 &&  this.teams[0].length === 2)){
            var team= [player];
            this.teams.push(team);
        }
        else if(this.teams.length === 1 && this.teams[0].length === 1){      
            this.teams[0].push(player);
        }
        else if(this.teams.length === 2 && this.teams[1].length === 1){   
            this.teams[1].push(player);
            this.startGame(); //Having 4 players... start the game!
        }
    },
    startGame : function startGame() {
        var game = Object.create(Game);
        game.init(this.teams, this.maxPoints, {
            
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
                //this.clientApi.requestTrump(clientId, isPushed);
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

