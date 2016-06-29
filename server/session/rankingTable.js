

import 'babel-polyfill';
import _ from 'lodash';

const RankingTable = {
    addPlayer(playerName) {
        let player = this.ranking.find(actPlayer => actPlayer.playerName === playerName);

        if (player) {
            player.connectedClients++;
        } else {
            this.ranking.push({
                rating: undefined,
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
    },

    updateRating(playerName, rating) {
        let player = this.ranking.find(actPlayer => actPlayer.playerName === playerName);
        player.rating = rating;
        this.ranking = _.sortByOrder(this.ranking, ['rating'], ['desc']);
        this.ranking = _.map(this.ranking, (elem, index) => {
            elem.rank = index + 1;
            return elem;
        });
    }
};


export function create() {
    let rankingTable = Object.create(RankingTable);
    rankingTable.ranking = [];
    rankingTable.pairingResults = [];
    return rankingTable;
}
