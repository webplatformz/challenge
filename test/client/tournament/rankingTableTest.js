import {expect} from 'chai';
import React from 'react';

import TestUtils from 'react-addons-test-utils';

import RankingTable from '../../../client/js/tournament/rankingTable.jsx';

describe('RankingTable', () => {

    let shallowRenderer = TestUtils.createRenderer(),
        props;

    beforeEach(() => {
        props = {
            ranking: [
                {
                    rank: 1,
                    playerName: 'Player A',
                    connectedClients: 1
                },
                {
                    rank: 2,
                    playerName: 'Player B',
                    connectedClients: 2
                },
                {
                    rank: 3,
                    playerName: 'Player B',
                    connectedClients: 1
                }
            ]
        };
    });

    it('should render table with given rankings, without displaying rating data', () => {
        shallowRenderer.render(React.createElement(RankingTable, props));

        let actual = shallowRenderer.getRenderOutput();

        let rankingRows = actual.props.children[1].props.children;

        rankingRows.forEach((rankingRow, index) => {
            let ranking = props.ranking[index];
            const playerNameContainer = rankingRow.props.children[1];
            expect(rankingRow.props.children[0].props.children).to.equal(ranking.rank);
            expect(playerNameContainer.props.children[0]).to.equal(ranking.playerName);
            expect(playerNameContainer.props.children[2]).to.be.undefined;
            expect(rankingRow.props.children[2]).to.be.undefined;
            expect(rankingRow.props.children[3].props.children).to.equal(ranking.connectedClients);
        });
    });

    it('should mark crashed bots', () => {
        props.ranking[1].crashed = true;
        shallowRenderer.render(React.createElement(RankingTable, props));

        let actual = shallowRenderer.getRenderOutput();

        let rankingRows = actual.props.children[1].props.children;
        expect(rankingRows[1].props.children[1].props.children[2].type).equal('img');
    });
});