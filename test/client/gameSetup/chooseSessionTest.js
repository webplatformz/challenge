'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react/addons';
import GameSetupStore from '../../../client/js/gameSetup/gameSetupStore';
import JassActions from '../../../client/js/jassActions';
import ExistingSessions from '../../../client/js/gameSetup/existingSessions.jsx';

const TestUtils = React.addons.TestUtils;

import ChooseSession from '../../../client/js/gameSetup/chooseSession.jsx';

describe('ChooseSession Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id chooseSession and class hidden', () => {
        shallowRenderer.render(React.createElement(ChooseSession, { setupState: { status: GameSetupStore.GameSetupState.CONNECTING }}));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('chooseSession');
        expect(actual._store.props.className).to.equal('hidden');
    });

    it('should remove class hidden when GameState CHOOSE_SESSION', () => {
        shallowRenderer.render(React.createElement(ChooseSession, { setupState: { status: GameSetupStore.GameSetupState.CHOOSE_SESSION }}));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('chooseSession');
        expect(actual._store.props.className).to.equal('');
    });

    it('should have the right children', () => {
        shallowRenderer.render(React.createElement(ChooseSession, { setupState: { status: GameSetupStore.GameSetupState.CHOOSE_SESSION }}));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual._store.props.children;
        expect(children[0].type).to.equal('h1');
        expect(children[1].type).to.equal(ExistingSessions);
        expect(children[2].type).to.equal('div');
        expect(children[2]._store.props.className).to.equal('session-choice');
        expect(children[3].type).to.equal('div');
        expect(children[3]._store.props.className).to.equal('session-choice');
    });

    it('should pass the sessions of GameSetupState to ExistingSessions', () => {
        let sessions = ['sessionName'];

        shallowRenderer.render(React.createElement(ChooseSession, { setupState: { status: GameSetupStore.GameSetupState.CHOOSE_SESSION, sessions }}));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual._store.props.children;
        expect(children[1]._store.props.sessions).to.equal(sessions);
    });

    it('should add event listeners to children', () => {
        shallowRenderer.render(React.createElement(ChooseSession, { setupState: { status: GameSetupStore.GameSetupState.CHOOSE_SESSION }}));
        let actual = shallowRenderer.getRenderOutput();

        let newSessionInput = actual._store.props.children[2]._store.props.children;
        expect(newSessionInput._store.props.onKeyPress.__reactBoundMethod).to.equal(ChooseSession.prototype.createNewSession);
        let autojoinInput = actual._store.props.children[3]._store.props.children;
        expect(autojoinInput._store.props.onClick.__reactBoundMethod).to.equal(ChooseSession.prototype.autojoinSession);
    });

    describe('createNewSession', () => {
        let eventDummy = {
                target: {
                    value: ''
                }
            },
            createNewSessionSpy;

        let createNewSession = ChooseSession.prototype.createNewSession;

        beforeEach(() => {
            createNewSessionSpy = sinon.stub(JassActions, 'createNewSession');
        });

        afterEach(() => {
            JassActions.createNewSession.restore();
        });

        it('should not start action with keypress which is not Enter', () => {
            eventDummy.charCode = 99;

            createNewSession(eventDummy);

            expect(createNewSessionSpy.called).to.equal(false);
        });


        it('should not start action with empty username', () => {
            eventDummy.charCode = 13;
            eventDummy.target.value = '';

            createNewSession(eventDummy);

            expect(createNewSessionSpy.called).to.equal(false);
        });

        it('should not start action with whitespace username', () => {
            eventDummy.charCode = 13;
            eventDummy.target.value = '   ';

            createNewSession(eventDummy);

            expect(createNewSessionSpy.called).to.equal(false);
        });

        it('should start action and disable input with valid playername and enter key pressed', () => {
            eventDummy.charCode = 13;
            eventDummy.target.value = 'sessionName';

            createNewSession(eventDummy);

            expect(createNewSessionSpy.withArgs(eventDummy.target.value).calledOnce).to.equal(true);
            expect(eventDummy.target.disabled).to.equal(true);
        });
    });

});