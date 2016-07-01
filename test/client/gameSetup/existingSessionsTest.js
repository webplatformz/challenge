

import {expect} from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';

import ExistingSessions from '../../../client/js/gameSetup/existingSessions.jsx';
import JassActions from '../../../client/js/jassActions';


describe('ExistingSessions Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    let joinExistingSessionSpy,
        joinExistingSessionAsSepctatorSpy;

    beforeEach(() => {
        joinExistingSessionSpy = sinon.spy(JassActions, 'joinExistingSession');
        joinExistingSessionAsSepctatorSpy = sinon.spy(JassActions, 'joinExistingSessionAsSpectator');
    });

    afterEach(() => {
        JassActions.joinExistingSession.restore();
        JassActions.joinExistingSessionAsSpectator.restore();
    });

    it('should render a div element with className and hidden list', () => {
        shallowRenderer.render(React.createElement(ExistingSessions));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.className).to.equal('session-choice');
        expect(actual.props.children.type).to.equal('ul');
        expect(actual.props.children.props.className).to.equal('hidden');
    });

    it('should show the list when there are existing sessions', () => {
        shallowRenderer.render(React.createElement(ExistingSessions, { sessions: ['sessionName']}));
        let actual = shallowRenderer.getRenderOutput();

        let list = actual.props.children;
        expect(list.props.className).to.equal('');
    });

    it('should append sessions and add event listeners to them', () => {
        shallowRenderer.render(React.createElement(ExistingSessions, { sessions: ['sessionName', 'sessionName2']}));
        let actual = shallowRenderer.getRenderOutput();

        let list = actual.props.children;
        expect(list.props.children.length).to.equal(2);
        let secondSession = list.props.children[1];
        expect(secondSession.type).to.equal('li');
        let playerJoin = secondSession.props.children[0];
        let spectatorJoin = secondSession.props.children[1];
        expect(playerJoin.props.children).to.equal('sessionName2');

        playerJoin.props.onClick();
        const spyWithArgs = joinExistingSessionSpy.withArgs('sessionName2');
        sinon.assert.calledOnce(spyWithArgs);
        expect(spectatorJoin.props.children).to.equal('S');

        spectatorJoin.props.onClick();
        sinon.assert.calledOnce(joinExistingSessionAsSepctatorSpy);
    });

});