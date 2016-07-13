import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react';
import ExistingSessions from '../../../client/js/gameSetup/existingSessions.jsx';
import {SessionType} from '../../../shared/session/sessionType';

import TestUtils from 'react-addons-test-utils';

import ChooseSession from '../../../client/js/gameSetup/chooseSession.jsx';
import {GameSetupState} from '../../../client/js/gameSetup/gameSetupStore';

describe('ChooseSession Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id chooseSession and class hidden', () => {
        shallowRenderer.render(React.createElement(ChooseSession, { step: GameSetupState.CONNECTING }));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('chooseSession');
        expect(actual.props.className).to.equal('hidden');
    });

    it('should remove class hidden when GameState CHOOSE_SESSION', () => {
        shallowRenderer.render(React.createElement(ChooseSession, { step: GameSetupState.CHOOSE_SESSION }));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('chooseSession');
        expect(actual.props.className).to.equal('');
    });

    it('should have the right children', () => {
        shallowRenderer.render(React.createElement(ChooseSession, { step: GameSetupState.CHOOSE_SESSION }));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children;
        expect(children[0].type).to.equal('h1');
        expect(children[1].type).to.equal(ExistingSessions);
        expect(children[2].type).to.equal('div');
        expect(children[2].props.className).to.equal('session-choice');
        expect(children[3].type).to.equal('div');
        expect(children[3].props.className).to.equal('session-choice');
        expect(children[4].type).to.equal('div');
        expect(children[4].props.className).to.equal('session-choice');
    });

    it('should pass correct params to ExistingSessions', () => {
        const props = {
            step: GameSetupState.CHOOSE_SESSION,
            sessions: ['sessionName'],
            joinExistingSession: () => {},
            joinExistingSessionSpectator: () => {}
        };

        shallowRenderer.render(React.createElement(ChooseSession, props));
        let actual = shallowRenderer.getRenderOutput();

        let existingSessionsProps = actual.props.children[1].props;
        expect(existingSessionsProps.sessions).to.equal(props.sessions);
        expect(existingSessionsProps.joinExistingSession).to.equal(props.joinExistingSession);
        expect(existingSessionsProps.joinExistingSessionSpectator).to.equal(props.joinExistingSessionSpectator);
    });

    it('should add event listeners to children', () => {
        const props = {
            step: GameSetupState.CHOOSE_SESSION,
            autojoinSession: sinon.spy(),
            createNewSession: sinon.spy()
        };
        shallowRenderer.render(React.createElement(ChooseSession, props));
        let actual = shallowRenderer.getRenderOutput();

        let newSessionInput = actual.props.children[2].props.children;
        newSessionInput.props.onKeyPress({target:{value:'testSingle'}, charCode:13});
        sinon.assert.calledWith(props.createNewSession, SessionType.SINGLE_GAME, 'testSingle', false);

        let newTournamentInput = actual.props.children[3].props.children;       
        newTournamentInput.props.onKeyPress({target:{value:'testTournament'}, charCode:13});
        sinon.assert.calledWith(props.createNewSession, SessionType.TOURNAMENT, 'testTournament', true);

        let autojoinInput = actual.props.children[4].props.children;
        autojoinInput.props.onClick();
        sinon.assert.calledOnce(props.autojoinSession);
    });

    describe('createNewSession', () => {
        let eventDummy = {
                target: {
                    value: ''
                }
            };

        let createNewSession,
            props;

        beforeEach(() => {
            props = {
                step: GameSetupState.CHOOSE_SESSION,
                createNewSession: sinon.spy()
            };
            shallowRenderer.render(React.createElement(ChooseSession, props));
            createNewSession = shallowRenderer.getRenderOutput().props.children[2].props.children.props.onKeyPress;
        });

        it('should not start action with keypress which is not Enter', () => {
            eventDummy.charCode = 99;

            createNewSession(eventDummy);
            sinon.assert.callCount(props.createNewSession, 0);
        });


        it('should not start action with empty username', () => {
            eventDummy.charCode = 13;
            eventDummy.target.value = '';

            createNewSession(eventDummy);

            sinon.assert.callCount(props.createNewSession, 0);
        });

        it('should not start action with whitespace username', () => {
            eventDummy.charCode = 13;
            eventDummy.target.value = '   ';

            createNewSession(eventDummy);

            sinon.assert.callCount(props.createNewSession, 0);
        });

        it('should start action and disable input with valid playername and enter key pressed', () => {
            eventDummy.charCode = 13;
            eventDummy.target.value = 'sessionName';

            createNewSession(eventDummy);

            sinon.assert.calledWith(props.createNewSession, SessionType.SINGLE_GAME, eventDummy.target.value);
            sinon.assert.callCount(props.createNewSession, 1);

            expect(eventDummy.target.disabled).to.equal(true);
        });
    });

});