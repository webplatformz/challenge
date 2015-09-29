'use strict';

import {expect} from 'chai';
import RankingTable from '../../../server/session/rankingTable.js';


describe('rankingTable', () => {

    let rankingTable;

    beforeEach(() => {
        rankingTable = RankingTable.create();
    });

    describe('addPairingResult', () => {
        it('should add pairings to the array', () => {
            let player1 = 'player1',
                player2 = 'player2',
                result1 = true,
                result2 = false;

            rankingTable.addPairingResult(player1, player2, result1);
            rankingTable.addPairingResult(player2, player1, result2);

            expect(rankingTable.pairingResults).to.have.length(2);
            expect(rankingTable.pairingResults[0].player1).to.equal(player1);
            expect(rankingTable.pairingResults[0].player2).to.equal(player2);
            expect(rankingTable.pairingResults[0].result).to.equal(result1);
            expect(rankingTable.pairingResults[1].player1).to.equal(player2);
            expect(rankingTable.pairingResults[1].player2).to.equal(player1);
            expect(rankingTable.pairingResults[1].result).to.equal(result2);
        });
    });

    describe('addPlayer', () => {
        it('should add Player to ranking', () => {
            var player1 = 'player1';

            rankingTable.addPlayer(player1);

            expect(rankingTable.ranking).to.have.length(1);
            expect(rankingTable.ranking[0].playerName).to.equal(player1);
            expect(rankingTable.ranking[0].connectedClients).to.equal(1);
        });

        it('should increment connectedClients', () => {
            var player1 = 'player1';

            rankingTable.addPlayer(player1);
            rankingTable.addPlayer(player1);

            expect(rankingTable.ranking[0].connectedClients).to.equal(2);
        });
    });
});