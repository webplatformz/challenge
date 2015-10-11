'use strict';

import {expect} from 'chai';
import React from 'react/addons';

const TestUtils = React.addons.TestUtils;

import TournamentTable from '../../../client/js/tournament/tournamentTable.jsx';

describe('Tournament table Component', () => {

    let shallowRenderer = TestUtils.createRenderer();

    it('should render a div with id, no class and onclick handler', () => {
        let props = {
            ratings: [
                {
                    player: "Player A",
                    wins: 2
                },
                {
                    player: "Player B",
                    wins: 3
                },
                {
                    player: "Player B",
                    wins: 3
                }
            ]
        };

        shallowRenderer.render(React.createElement(TournamentTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual._store.props.children;

        let tableRows = children[1]._store.props.children;
    });

});