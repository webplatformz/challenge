

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
        this.pairingResults.unshift({
            player1,
            player2,
            firstPlayerWon
        });
    },

    updatePlayerRating(playerName, rating) {
        this.ranking.find(actPlayer => actPlayer.playerName === playerName).rating = rating;
    },

    updateAndSortRanking() {
        this.ranking = this.ranking
            .sort((a, b) => b.rating - a.rating)
            .map((elem, index) => {
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
