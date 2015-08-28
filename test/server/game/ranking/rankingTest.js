'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import glicko2 from 'glicko2';
import Ranking from '../../../../server/game/ranking/ranking';

describe('Ranking', function () {

    let makePlayerSpy,
        updateRatingsSpy;

    beforeEach(() => {
        makePlayerSpy = sinon.stub(glicko2.Glicko2.prototype, 'makePlayer');
        updateRatingsSpy = sinon.stub(glicko2.Glicko2.prototype, 'updateRatings');
    });

    afterEach(() => {
        glicko2.Glicko2.prototype.makePlayer.restore();
        glicko2.Glicko2.prototype.updateRatings.restore();
    });

    describe('addPlayer', function () {
        it('should call makePlayer from glicko', function() {
            let player = 'player';

            Ranking.addPlayer(player);

            expect(makePlayerSpy.calledOnce).to.equal(true);
        });
    });

    describe('updateRatings', function() {
        it('should call updateRatings witch match results saved by updateMatchResult', function() {
            let player1 = 'player1',
                player2 = 'player2';
            Ranking.addPlayer(player1);
            Ranking.addPlayer(player2);

            Ranking.updateMatchResult({winner: player1, loser: player2});
            Ranking.updateMatchResult({winner: player2, loser: player1});

            Ranking.updateRatings();

            expect(updateRatingsSpy.withArgs([
                [sinon.match.object, sinon.match.object, 1],
                [sinon.match.object, sinon.match.object, 1]
            ]).calledOnce).to.equal(true);
        });
    });
});