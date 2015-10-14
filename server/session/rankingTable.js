'use strict';

import {polyfill} from 'babel';

let RankingTable = {
    addPlayer(playerName) {
        let player = this.ranking.find(actPlayer => actPlayer.playerName === playerName);

        if (player) {
            player.connectedClients++;
        } else {
            this.ranking.push({
                rank: undefined,
                playerName,
                connectedClients: 1
            });
        }
    },

    addPairingResult(player1, player2, firstPlayerWon) {
        this.pairingResults.push({
            player1,
            player2,
            firstPlayerWon: firstPlayerWon
        });
    }
};


export default {
    create() {
        let rankingTable = Object.create(RankingTable);
        rankingTable.ranking = [];
        rankingTable.pairingResults = [];
        return rankingTable;
    }
};