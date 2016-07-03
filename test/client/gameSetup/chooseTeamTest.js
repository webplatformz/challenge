import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react';

import TestUtils from 'react-addons-test-utils';

import ChooseTeam from '../../../client/js/gameSetup/chooseTeam.jsx';
import {GameSetupStep} from '../../../client/js/reducers/gameSetup';

describe('ChooseTeam Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    describe('in GameState CHOSSE_SESISON', () => {

        shallowRenderer.render(React.createElement(ChooseTeam, { step: GameSetupStep.CHOOSE_SESSION }));
        let actual = shallowRenderer.getRenderOutput();

        it('should render hidden in GameState CHOOSE_SESSION', () => {
            expect(actual.type).to.equal('div');
            expect(actual.props.id).to.equal('chooseTeam');
            expect(actual.props.className).to.equal('hidden');
        });

    });

    describe('in GameState CHOOSE_TEAM', () => {

        let setupState = {
           step: GameSetupStep.CHOOSE_TEAM,
           chosenSession: {
               sessionName: 'sessionDummy',
               joinSession: undefined
           }
        };
        let joinSessionSpy = undefined;

        shallowRenderer.render(React.createElement(ChooseTeam, setupState));
        let actual = shallowRenderer.getRenderOutput();
        let children = actual.props.children;
        let teamButtons = children[2].props.children;

        beforeEach(() => {
            setupState.chosenSession.joinSession = sinon.spy();
            joinSessionSpy = setupState.chosenSession.joinSession;
        });

        it('should render the UI to choose a team', () => {

            let noHiddenClass = '';
            expect(actual.type).to.equal('div');
            expect(actual.props.id).to.equal('chooseTeam');
            expect(actual.props.className).to.equal(noHiddenClass);

            expect(children[0].type).to.equal('h1');
            expect(children[1].type).to.equal('h2');
            expect(children[2].type).to.equal('div');
            expect(children[2].props.className).to.equal('team-choice');

        });

        it('should call joinSession with team 1 when team 1 button is pressed', () => {
            let chooseTeam1Spy = joinSessionSpy.withArgs(0);
            teamButtons[0].props.onClick();
            sinon.assert.calledOnce(chooseTeam1Spy);
        });

        it('should call joinSession with team 2 when team 2 button is pressed', () => {
            let chooseTeam2Spy = joinSessionSpy.withArgs(1);
            teamButtons[1].props.onClick();
            sinon.assert.calledOnce(chooseTeam2Spy);
        });

        it('should call joinSession for undefined team when team any button is pressed', () => {
            teamButtons[2].props.onClick();
            sinon.assert.calledOnce(joinSessionSpy);
            sinon.assert.calledWithExactly(joinSessionSpy);
        });

    });

});