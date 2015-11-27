'use strict';

import glicko2 from 'glicko2';
import {polyfill} from 'babel';

let Ranking = {
    addPlayer (playerName) {
        this.players.push({
            name: playerName,
            player: this.ranking.makePlayer()
        });
    },

    getPlayer (playerName) {
        return this.players.find((player) => {
            return player.name === playerName;
        });
    },

    updateMatchResult ({winner, loser}) {
        this.matches.push([
            this.getPlayer(winner).player,
            this.getPlayer(loser).player,
            1
        ]);
    },

    updateRatings() {
        this.ranking.updateRatings(this.matches);
        this.matches = [];
    }
};

export default {
    create() {
        let ranking = Object.create(Ranking);
        ranking.matches = [];
        ranking.players = [];

        ranking.ranking = new glicko2.Glicko2({
            // tau : "Reasonable choices are between 0.3 and 1.2, though the system should
            // be tested to decide which value results in greatest predictive accuracy."
            tau: 0.5,
            // rating : default rating
            rating: 1500,
            //rd : Default rating deviation
            //     small number = good confidence on the rating accuracy
            rd: 200,
            //vol : Default volatility (expected fluctation on the player rating)
            vol: 0.06
        });

        return ranking;
    }
};
