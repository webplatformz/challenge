'use strict';

import {expect} from 'chai';
import React from 'react';
import {CardType} from '../../../client/js/game/gameStore';
import JassActions from '../../../client/js/jassActions';
import sinon from 'sinon';

import TestUtils from 'react-addons-test-utils';

import CardTypeSwitcher from '../../../client/js/game/cardTypeSwitcher.jsx';

describe('CardTypeSwitcher Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    let changeCardTypeStub;

    beforeEach(() => {
        changeCardTypeStub = sinon.stub(JassActions, 'changeCardType');
    });

    afterEach(() => {
        JassActions.changeCardType.restore();
    });

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(CardTypeSwitcher));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('cardTypeSwitcher');
    });

    it('should render a child for each CardType and append click handler to it', () => {
        shallowRenderer.render(React.createElement(CardTypeSwitcher));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children;
        expect(children.length).to.equal(Object.keys(CardType).length);
        expect(children[0].props.children.props.onClick.__reactBoundMethod).to.equal(CardTypeSwitcher.prototype.changeCardType);
        expect(children[1].props.children.props.onClick.__reactBoundMethod).to.equal(CardTypeSwitcher.prototype.changeCardType);
    });

    it('should bind clickHandlers with correct cardType parameter', () => {
        shallowRenderer.render(React.createElement(CardTypeSwitcher));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children;
        children[0].props.children.props.onClick();
        children[1].props.children.props.onClick();
        expect(changeCardTypeStub.withArgs('french').calledOnce).to.equal(true);
        expect(changeCardTypeStub.withArgs('german').calledOnce).to.equal(true);
    });

});