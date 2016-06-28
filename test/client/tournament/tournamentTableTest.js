'use strict';

import {expect} from 'chai';
import React from 'react';
import JassActions from '../../../client/js/jassActions.js';

import TestUtils from 'react-addons-test-utils';

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
        expect(actual.props.id).to.equal('tournamentTable');
    });

    it('should render start button with click handler', () => {
        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let button = actual.props.children[4];
        expect(button.type).to.equal('button');
        expect(button.props.onClick).to.equal(JassActions.startTournament);
    });

    it('should not render start button when tournament started', () => {
        props.started = true;

        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[4]).to.equal(undefined);
    });

    it('should render table with rankings', () => {
        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let rankingRows = actual.props.children[1].props.children[1].props.children;
        rankingRows.forEach((rankingRow, index) => {
            let ranking = props.rankingTable.ranking[index];

            expect(rankingRow.props.children[0].props.children).to.equal(ranking.rank);
            expect(rankingRow.props.children[1].props.children).to.equal(ranking.playerName);
            expect(rankingRow.props.children[2].props.children).to.equal(ranking.connectedClients);
        });
    });

    it('should render table with pairings', () => {
        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let pairingRows = actual.props.children[3].props.children.props.children;
        pairingRows.forEach((rankingRow, index) => {
            let pairing = props.rankingTable.pairingResults[index];

            if (pairing.firstPlayerWon) {
                expect(rankingRow.props.children[0].props.children[0].type).to.equal('object');
                expect(rankingRow.props.children[1].props.children[0]).to.equal(undefined);
            } else {
                expect(rankingRow.props.children[1].props.children[0].type).to.equal('object');
                expect(rankingRow.props.children[0].props.children[0]).to.equal(undefined);
            }

            expect(rankingRow.props.children[0].props.children[1]).to.equal(pairing.player1);
            expect(rankingRow.props.children[1].props.children[1]).to.equal(pairing.player2);
        });
    });

});