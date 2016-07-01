import {expect} from 'chai';
import React from 'react';
import JassActions from '../../../client/js/jassActions';
import TournamentStore from '../../../client/js/tournament/tournamentStore';

import TestUtils from 'react-addons-test-utils';

import TournamentTable from '../../../client/js/tournament/tournamentTable.jsx';

describe('Tournament table Component', () => {

    let shallowRenderer = TestUtils.createRenderer();

    it('should render a div with id', () => {
        shallowRenderer.render(React.createElement(TournamentTable));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('tournamentTable');
    });

    it('should pass correct properties to children', () => {
        TournamentStore.state.registryBots = 'bots';
        TournamentStore.state.rankingTable = {
            ranking: 'ranking',
            pairingResults: 'pairingResults'
        };

        shallowRenderer.render(React.createElement(TournamentTable));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[1].props.bots).to.equal(TournamentStore.state.registryBots);
        expect(actual.props.children[3].props.ranking).to.equal(TournamentStore.state.rankingTable.ranking);
        expect(actual.props.children[5].props.pairings).to.equal(TournamentStore.state.rankingTable.pairingResults);
    });

    it('should render start button with click handler when not started', () => {
        TournamentStore.state.tournamentStarted = false;

        shallowRenderer.render(React.createElement(TournamentTable));
        let actual = shallowRenderer.getRenderOutput();

        let button = actual.props.children[6];
        expect(button.type).to.equal('button');
        expect(button.props.onClick).to.equal(JassActions.startTournament);
    });

    it('should not render start button when tournament started', () => {
        TournamentStore.state.tournamentStarted = true;

        shallowRenderer.render(React.createElement(TournamentTable));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[6]).to.equal(undefined);
    });

   

});
