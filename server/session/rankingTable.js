const RankingTable = {
    findPlayerByName(playerName) {
        return this.ranking.find(actPlayer => actPlayer.playerName === playerName);
    },

    addPlayer(playerName) {
        const player = this.findPlayerByName(playerName);

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

    removePlayer(playerName) {
        const player = this.findPlayerByName(playerName);

        if (player.connectedClients > 1) {
            player.connectedClients--;
        } else {
            this.ranking = this.ranking.filter(actPlayer => actPlayer !== player);
        }
    },

    markPlayerAsCrashed(playerName) {
        this.findPlayerByName(playerName).crashed = true;
    },

    addPairingResult(player1, player2, firstPlayerWon) {
        this.pairingResults.unshift({
            player1,
            player2,
            firstPlayerWon,
            id: this.pairingResults.length
        });
    },

    updatePlayerRating(playerName, rating) {
        this.findPlayerByName(playerName).rating = rating;
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
