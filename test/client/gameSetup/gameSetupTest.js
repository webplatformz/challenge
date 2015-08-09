'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import Connecting from '../../../client/js/gameSetup/connecting.jsx';
import RequestPlayerName from '../../../client/js/gameSetup/requestPlayerName.jsx';
import ChooseSession from '../../../client/js/gameSetup/chooseSession.jsx';
import GameSetupStore from '../../../client/js/gameSetup/gameSetupStore';

const TestUtils = React.addons.TestUtils;

import GameSetup from '../../../client/js/gameSetup/gameSetup.jsx';

describe('JassApp Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id gameSetup', () => {
        shallowRenderer.render(React.createElement(GameSetup));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('gameSetup');
    });

    it('should render the children Connecting, RequestPlayerName and ChooseSession', () => {
        shallowRenderer.render(React.createElement(GameSetup));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual._store.props.children[0].type).to.equal(Connecting);
        expect(actual._store.props.children[1].type).to.equal(RequestPlayerName);
        expect(actual._store.props.children[2].type).to.equal(ChooseSession);
    });

    it('should pass the correct properties to its children', () => {
        shallowRenderer.render(React.createElement(GameSetup));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual._store.props.children[0]._store.props.setupState).to.equal(GameSetupStore.GameSetupState.CONNECTING);
        expect(actual._store.props.children[1]._store.props.setupState).to.equal(GameSetupStore.GameSetupState.CONNECTING);
        expect(actual._store.props.children[2]._store.props.setupState).to.eql(GameSetupStore.state);
    });

    it('should change className when finished', () => {
        GameSetupStore.state.status = GameSetupStore.GameSetupState.FINISHED;

        shallowRenderer.render(React.createElement(GameSetup));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual._store.props.className).to.equal('finished');
    });
});