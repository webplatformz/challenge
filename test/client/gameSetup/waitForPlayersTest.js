'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react';
import GameSetupStore from '../../../client/js/gameSetup/gameSetupStore';

import TestUtils from 'react-addons-test-utils';

import WaitForPlayers from '../../../client/js/gameSetup/waitForPlayers.jsx';
import JassActions from "../../../client/js/jassActions";

describe('WaitForPlayers Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    let joinBotSpy;

    beforeEach(() => {
        joinBotSpy = sinon.spy(JassActions, 'joinBot');
    });

    afterEach(() => {
        JassActions.joinBot.restore();
    });


    it('should render hidden in GameState CHOOSE_SESSION', () => {
        shallowRenderer.render(React.createElement(WaitForPlayers, {setupState: {status: GameSetupStore.GameSetupState.CHOOSE_SESSION}}));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('waitForPlayers');
        expect(actual.props.className).to.equal('hidden');
    });

    it('should render in GameState WAIT_FOR_PLAYERS', () => {
        shallowRenderer.render(React.createElement(WaitForPlayers, {setupState: {status: GameSetupStore.GameSetupState.WAIT_FOR_PLAYERS}}));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.className).not.to.equal('hidden');
    });

    it('should handle clicks on buttons', () => {
        const props = {
            setupState: {
                status: GameSetupStore.GameSetupState.WAIT_FOR_PLAYERS,
                chosenSession: {
                    sessionName: 'sessionName'
                }
            }
        };

        shallowRenderer.render(React.createElement(WaitForPlayers, props));
        let actual = shallowRenderer.getRenderOutput();

        const buttons = actual.props.children[2].props.children;

        buttons[0].props.onClick();
        sinon.assert.calledWith(joinBotSpy, props.setupState.chosenSession.sessionName, 0);

        buttons[1].props.onClick();
        sinon.assert.calledWith(joinBotSpy, props.setupState.chosenSession.sessionName, 1);

        sinon.assert.calledTwice(joinBotSpy);
    });
    
});