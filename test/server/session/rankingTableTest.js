

import {expect} from 'chai';
import * as RankingTable from '../../../server/session/rankingTable';


describe('rankingTable', () => {

    let rankingTable;

    beforeEach(() => {
        rankingTable = RankingTable.create();
    });

    describe('addPairingResult', () => {
        it('should add pairings to the array', () => {
            let player1 = 'player1',
                player2 = 'player2',
                firstPlayerWon1 = true,
                firstPlayerWon2 = false;

            rankingTable.addPairingResult(player1, player2, firstPlayerWon1);
            rankingTable.addPairingResult(player2, player1, firstPlayerWon2);

            expect(rankingTable.pairingResults).to.have.length(2);
            expect(rankingTable.pairingResults[0].player1).to.equal(player1);
            expect(rankingTable.pairingResults[0].player2).to.equal(player2);
            expect(rankingTable.pairingResults[0].firstPlayerWon).to.equal(firstPlayerWon1);
            expect(rankingTable.pairingResults[1].player1).to.equal(player2);
            expect(rankingTable.pairingResults[1].player2).to.equal(player1);
            expect(rankingTable.pairingResults[1].firstPlayerWon).to.equal(firstPlayerWon2);
        });
    });

    describe('addPlayer', () => {
        it('should add Player to ranking', () => {
            const player1 = 'player1';

            rankingTable.addPlayer(player1);

            expect(rankingTable.ranking).to.have.length(1);
            expect(rankingTable.ranking[0].playerName).to.equal(player1);
            expect(rankingTable.ranking[0].connectedClients).to.equal(1);
        });

        it('should increment connectedClients', () => {
            const player1 = 'player1';

            rankingTable.addPlayer(player1);
            rankingTable.addPlayer(player1);

            expect(rankingTable.ranking[0].connectedClients).to.equal(2);
        });
    });

    describe('updatePlayerRating', () => {
        it('should update given player rating', () => {
            const player1 = 'player1',
                player2 = 'player2';

            rankingTable.addPlayer(player1);
            rankingTable.addPlayer(player2);

            rankingTable.updatePlayerRating(player1, 999);
            rankingTable.updatePlayerRating(player2, 1000);

            expect(rankingTable.ranking.find(player => player.playerName === player1).rating).to.equal(999);
            expect(rankingTable.ranking.find(player => player.playerName === player2).rating).to.equal(1000);
        });
    });

    describe('updateAndSortRanking', () => {
        it('should sort table and set ranks', () => {
            const player1 = 'player1',
                player2 = 'player2',
                player3 = 'player3';

            rankingTable.addPlayer(player1);
            rankingTable.addPlayer(player2);
            rankingTable.addPlayer(player3);

            rankingTable.updatePlayerRating(player1, 999);
            rankingTable.updatePlayerRating(player2, 1000);
            rankingTable.updatePlayerRating(player3, 998);

            rankingTable.updateAndSortRanking();

            expect(rankingTable.ranking[0].playerName).to.equal(player2);
            expect(rankingTable.ranking[0].rating).to.equal(1000);
            expect(rankingTable.ranking[1].playerName).to.equal(player1);
            expect(rankingTable.ranking[1].rating).to.equal(999);
            expect(rankingTable.ranking[2].playerName).to.equal(player3);
            expect(rankingTable.ranking[2].rating).to.equal(998);
        });
    });
});