'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import JassActions from '../../../client/js/jassActions.js';

const TestUtils = React.addons.TestUtils;

import TournamentTable from '../../../client/js/tournament/tournamentTable.jsx';

describe('Tournament table Component', () => {

    let shallowRenderer = TestUtils.createRenderer(),
        props = {
            rankingTable: {
                ranking: [
                    {
                        rank: 1,
                        playerName: "Player A",
                        connectedClients: 1
                    },
                    {
                        rank: 2,
                        playerName: "Player B",
                        connectedClients: 2
                    },
                    {
                        rank: 3,
                        playerName: "Player B",
                        connectedClients: 1
                    }
                ]
            }
        };

    it('should render a div with id', () => {
        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('tournamentTable');
    });

    it('should render start button with click handler', () => {
        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let button = actual._store.props.children[2];
        expect(button.type).to.equal('button');
        expect(button._store.props.onClick).to.equal(JassActions.startTournament);
    });

    it('should render table with rankings', () => {
        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let rankingRows = actual._store.props.children[1]._store.props.children[1]._store.props.children;
        rankingRows.forEach((rankingRow, index) => {
            let ranking = props.rankingTable.ranking[index];

            expect(rankingRow._store.props.children[0]._store.props.children).to.equal(ranking.rank);
            expect(rankingRow._store.props.children[1]._store.props.children).to.equal(ranking.playerName);
            expect(rankingRow._store.props.children[2]._store.props.children).to.equal(ranking.connectedClients);
        });
    });

});