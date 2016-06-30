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

    it('should render table with given rankings', () => {
        shallowRenderer.render(React.createElement(RankingTable, props));

        let actual = shallowRenderer.getRenderOutput();

        let rankingRows = actual.props.children[1].props.children;
        rankingRows.forEach((rankingRow, index) => {
            let ranking = props.ranking[index];

            expect(rankingRow.props.children[0].props.children).to.equal(ranking.rank);
            expect(rankingRow.props.children[1].props.children).to.equal(ranking.playerName);
            expect(rankingRow.props.children[2].props.children).to.equal(ranking.connectedClients);
        });
    });
});