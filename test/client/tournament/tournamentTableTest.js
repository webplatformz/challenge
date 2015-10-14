'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import JassActions from '../../../client/js/jassActions.js';

const TestUtils = React.addons.TestUtils;

import TournamentTable from '../../../client/js/tournament/tournamentTable.jsx';

describe('Tournament table Component', () => {

    let shallowRenderer = TestUtils.createRenderer(),
        props;

    beforeEach(() => {
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
                ],
                pairingResults: [
                    {
                        player1: "Player A",
                        player2: "Player C",
                        firstPlayerWon: true
                    },
                    {
                        player1: "Player B",
                        player2: "Player A",
                        firstPlayerWon: false
                    }
                ]
            },
            started: false
        };
    });

    it('should render a div with id', () => {
        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('tournamentTable');
    });

    it('should render start button with click handler', () => {
        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let button = actual._store.props.children[4];
        expect(button.type).to.equal('button');
        expect(button._store.props.onClick).to.equal(JassActions.startTournament);
    });

    it('should not render start button when tournament started', () => {
        props.started = true;

        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual._store.props.children[4]).to.equal(undefined);
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

    it('should render table with pairings', () => {
        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let pairingRows = actual._store.props.children[3]._store.props.children;
        pairingRows.forEach((rankingRow, index) => {
            let pairing = props.rankingTable.pairingResults[index];

            if (pairing.firstPlayerWon) {
                expect(rankingRow._store.props.children[0]._store.props.children[0].type).to.equal('object');
                expect(rankingRow._store.props.children[1]._store.props.children[0]).to.equal(undefined);
            } else {
                expect(rankingRow._store.props.children[1]._store.props.children[0].type).to.equal('object');
                expect(rankingRow._store.props.children[0]._store.props.children[0]).to.equal(undefined);
            }

            expect(rankingRow._store.props.children[0]._store.props.children[1]).to.equal(pairing.player1);
            expect(rankingRow._store.props.children[1]._store.props.children[1]).to.equal(pairing.player2);
        });
    });

});