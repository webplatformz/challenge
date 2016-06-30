import {expect} from 'chai';
import React from 'react';
import ErrorToast from '../../client/js/error/errorToast.jsx';
import GameSetup from '../../client/js/gameSetup/gameSetup.jsx';
import JassTable from '../../client/js/game/jassTable.jsx';
import TournamentTable from '../../client/js/tournament/tournamentTable.jsx';
import JassAppStore from '../../client/js/jassAppStore';
import {SessionType} from '../../shared/session/sessionType';

import TestUtils from 'react-addons-test-utils';

import JassApp from '../../client/js/jassApp.jsx';

describe('JassApp Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with children ErrorToast', () => {
        shallowRenderer.render(React.createElement(JassApp));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.children[0].type).to.equal(ErrorToast);
        expect(actual.props.children[1].type).to.equal(GameSetup);
    });

    it('should render JassTable if SessionType SINGLE_GAME', () => {
        JassAppStore.state.sessionType = SessionType.SINGLE_GAME;

        shallowRenderer.render(React.createElement(JassApp));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[2].type).to.equal(JassTable);
    });

    it('should render JassTable if SessionType TOURNAMENT', () => {
        JassAppStore.state.sessionType = SessionType.TOURNAMENT;

        shallowRenderer.render(React.createElement(JassApp));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[2].type).to.equal(TournamentTable);
    });

    it('should pass error State to ErrorToast', () => {
        JassAppStore.state.error = 'someError';

        shallowRenderer.render(React.createElement(JassApp));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[0].props.error).to.equal(JassAppStore.state.error);
    });

});