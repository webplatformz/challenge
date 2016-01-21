'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react/addons';
import GameSetupStore from '../../../client/js/gameSetup/gameSetupStore';
import JassActions from '../../../client/js/jassActions.js';

const TestUtils = React.addons.TestUtils;

import RequestPlayerName from '../../../client/js/gameSetup/requestPlayerName.jsx';

describe('RequestPlayerName Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id requestPlayerName and class hidden', () => {
        shallowRenderer.render(React.createElement(RequestPlayerName, { setupState: GameSetupStore.GameSetupState.CONNECTING }));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('requestPlayerName');
        expect(actual.props.className).to.equal('hidden');
    });

    it('should remove class hidden when setupState SET_PLAYER_NAME', () => {
        shallowRenderer.render(React.createElement(RequestPlayerName, { setupState: GameSetupStore.GameSetupState.SET_PLAYER_NAME }));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.className).to.equal('');
    });

    it('should add function onKeyPress to input', () => {
        shallowRenderer.render(React.createElement(RequestPlayerName, { setupState: GameSetupStore.GameSetupState.SET_PLAYER_NAME }));
        let actual = shallowRenderer.getRenderOutput();

        let input = actual.props.children;
        expect(input.type).to.equal('input');
        expect(input.props.onKeyPress.__reactBoundMethod).to.equal(RequestPlayerName.prototype.choosePlayerName);
    });

    describe('choosePlayerName', () => {
        let eventDummy = {
                target: {
                    value: ''
                }
            },
            choosePlayerNameSpy;

        let choosePlayerName = RequestPlayerName.prototype.choosePlayerName;

        beforeEach(() => {
            choosePlayerNameSpy = sinon.stub(JassActions, 'choosePlayerName');
        });

        afterEach(() => {
            JassActions.choosePlayerName.restore();
        });

        it('should not start action with keypress which is not Enter', () => {
            eventDummy.charCode = 99;

            choosePlayerName(eventDummy);

            expect(choosePlayerNameSpy.called).to.equal(false);
        });


        it('should not start action with empty username', () => {
            eventDummy.charCode = 13;
            eventDummy.target.value = '';

            choosePlayerName(eventDummy);

            expect(choosePlayerNameSpy.called).to.equal(false);
        });

        it('should not start action with whitespace username', () => {
            eventDummy.charCode = 13;
            eventDummy.target.value = '   ';

            choosePlayerName(eventDummy);

            expect(choosePlayerNameSpy.called).to.equal(false);
        });

        it('should start action and disable input with valid playername and enter key pressed', () => {
            eventDummy.charCode = 13;
            eventDummy.target.value = 'playerName';

            choosePlayerName(eventDummy);

            expect(choosePlayerNameSpy.withArgs(eventDummy.target.value).calledOnce).to.equal(true);
            expect(eventDummy.target.disabled).to.equal(true);
        });
    });

});