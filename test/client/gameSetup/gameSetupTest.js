

import {expect} from 'chai';
import React from 'react';
import Connecting from '../../../client/js/gameSetup/connecting.jsx';
import RequestPlayerName from '../../../client/js/gameSetup/requestPlayerName.jsx';
import ChooseSession from '../../../client/js/gameSetup/chooseSession.jsx';
import {default as GameSetupStore, GameSetupState} from '../../../client/js/gameSetup/gameSetupStore';

import TestUtils from 'react-addons-test-utils';

import GameSetup from '../../../client/js/gameSetup/gameSetup.jsx';

describe('GameSetup Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id gameSetup', () => {
        shallowRenderer.render(React.createElement(GameSetup));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('gameSetup');
    });

    it('should render the children Connecting, RequestPlayerName and ChooseSession', () => {
        shallowRenderer.render(React.createElement(GameSetup));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[0].type).to.equal(Connecting);
        expect(actual.props.children[1].type).to.equal(RequestPlayerName);
        expect(actual.props.children[2].type).to.equal(ChooseSession);
    });

    it('should pass the correct properties to its children', () => {
        GameSetupStore.state.status = GameSetupState.CONNECTING;

        shallowRenderer.render(React.createElement(GameSetup));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[0].props.setupState).to.equal(GameSetupState.CONNECTING);
        expect(actual.props.children[1].props.setupState).to.equal(GameSetupState.CONNECTING);
        expect(actual.props.children[2].props.setupState).to.eql(GameSetupStore.state);
    });

    it('should change className when finished', () => {
        GameSetupStore.state.status = GameSetupState.FINISHED;

        shallowRenderer.render(React.createElement(GameSetup));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.className).to.equal('finished');
    });
});