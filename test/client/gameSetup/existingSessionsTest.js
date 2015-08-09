'use strict';

import {expect} from 'chai';
import React from 'react/addons';

const TestUtils = React.addons.TestUtils;

import ExistingSessions from '../../../client/js/gameSetup/existingSessions.jsx';

describe('ExistingSessions Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with className and hidden list', () => {
        shallowRenderer.render(React.createElement(ExistingSessions));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.className).to.equal('session-choice');
        expect(actual._store.props.children.type).to.equal('ul');
        expect(actual._store.props.children._store.props.className).to.equal('hidden');
    });

    it('should show the list when there are existing sessions', () => {
        shallowRenderer.render(React.createElement(ExistingSessions, { sessions: ['sessionName']}));
        let actual = shallowRenderer.getRenderOutput();

        let list = actual._store.props.children;
        expect(list._store.props.className).to.equal('');
    });

    it('should append sessions and add event listeners to them', () => {
        shallowRenderer.render(React.createElement(ExistingSessions, { sessions: ['sessionName', 'sessionName2']}));
        let actual = shallowRenderer.getRenderOutput();

        let list = actual._store.props.children;
        expect(list._store.props.children.length).to.equal(2);
        let secondSession = list._store.props.children[1];
        expect(secondSession.type).to.equal('li');
        let playerJoin = secondSession._store.props.children[0];
        let spectatorJoin = secondSession._store.props.children[1];
        expect(playerJoin._store.props.children).to.equal('sessionName2');
        expect(playerJoin._store.props.onClick.__reactBoundMethod).to.equal(ExistingSessions.prototype.joinExistingSession);
        expect(spectatorJoin._store.props.children).to.equal('S');
        expect(spectatorJoin._store.props.onClick.__reactBoundMethod).to.equal(ExistingSessions.prototype.joinExistingSessionAsSpectator);
    });

});