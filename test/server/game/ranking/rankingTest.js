'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import glicko2 from 'glicko2';
import Ranking from '../../../../server/game/ranking/ranking';

describe('Ranking', function () {

    let ranking;

    beforeEach(() => {
        ranking = Ranking.create();
    });

    describe('addPlayer', () => {
        it('should add player to glicko2', () => {
            let player1 = 'player1',
                player2 = 'player2';

            ranking.addPlayer(player1);
            ranking.addPlayer(player2);

            expect(ranking.ranking.getPlayers()).to.have.length(2);
        });
    });

    describe('updateRatings', function() {
        it('should call updateRatings with match results saved by updateMatchResult', function() {
            let player1 = 'player1',
                player2 = 'player2';

            ranking.addPlayer(player1);
            ranking.addPlayer(player2);

            ranking.updateMatchResult({winner: player1, loser: player2});
            ranking.updateMatchResult({winner: player2, loser: player1});

            ranking.updateRatings();

            let players = ranking.ranking.getPlayers();
            expect(players[0].outcomes).to.eql([1,0]);
            expect(players[1].outcomes).to.eql([0,1]);
        });
    });
});