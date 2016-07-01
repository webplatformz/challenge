import {expect} from 'chai';
import React from 'react';

import TestUtils from 'react-addons-test-utils';

import PairingsTable from '../../../client/js/tournament/pairingsTable.jsx';

describe('PairingsTable', () => {

    let shallowRenderer = TestUtils.createRenderer(),
        props;

    beforeEach(() => {
        props = {
            pairings: [
                {
                    player1: 'Player A',
                    player2: 'Player C',
                    firstPlayerWon: true
                },
                {
                    player1: 'Player B',
                    player2: 'Player A',
                    firstPlayerWon: false
                }
            ]
        };
    });

    it('should render table with pairings', () => {
        shallowRenderer.render(React.createElement(PairingsTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let pairingRows = actual.props.children.props.children;
        pairingRows.forEach((rankingRow, index) => {
            let pairing = props.pairings[index];

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