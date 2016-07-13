import {expect} from 'chai';
import React from 'react';
import Connecting from '../../../client/js/gameSetup/connecting.jsx';
import RequestPlayerName from '../../../client/js/gameSetup/requestPlayerName.jsx';
import ChooseSession from '../../../client/js/gameSetup/chooseSession.jsx';
import {GameSetupComponent} from '../../../client/js/gameSetup/gameSetup.jsx';
import {GameSetupStep} from '../../../client/js/reducers/gameSetup';

import TestUtils from 'react-addons-test-utils';


describe('GameSetup Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id gameSetup', () => {
        shallowRenderer.render(React.createElement(GameSetupComponent));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('gameSetup');
    });

    it('should render the children Connecting, RequestPlayerName and ChooseSession', () => {
        shallowRenderer.render(React.createElement(GameSetupComponent));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[0].type).to.equal(Connecting);
        expect(actual.props.children[1].type).to.equal(RequestPlayerName);
        expect(actual.props.children[2].type).to.equal(ChooseSession);
    });

    it('should pass the correct properties to its children', () => {
        const props = {
            step: GameSetupStep.CONNECTING,
            sessions: [],
            autojoinSession: () => {},
            createNewSession: () => {},
            joinExistingSession: () => {},
            joinExistingSessionSpectator: () => {}
        };

        shallowRenderer.render(React.createElement(GameSetupComponent, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[0].props.step).to.equal(props.step);
        expect(actual.props.children[1].props.step).to.equal(props.step);
        expect(actual.props.children[2].props.step).to.eql(props.step);
        expect(actual.props.children[2].props.sessions).to.eql(props.sessions);
        expect(actual.props.children[2].props.autojoinSession).to.eql(props.autojoinSession);
        expect(actual.props.children[2].props.createNewSession).to.eql(props.createNewSession);
        expect(actual.props.children[2].props.joinExistingSession).to.eql(props.joinExistingSession);
        expect(actual.props.children[2].props.joinExistingSessionSpectator).to.eql(props.joinExistingSessionSpectator);
        expect(actual.props.children[3].props.step).to.equal(props.step);
        expect(actual.props.children[3].props.chosenSession).to.equal(props.chosenSession);
    });

    it('should change className when finished', () => {
        const props = {
            step: GameSetupStep.FINISHED
        };

        shallowRenderer.render(React.createElement(GameSetupComponent, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.className).to.equal('finished');
    });
});