'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import {CardType} from '../../../client/js/game/gameStore';

const TestUtils = React.addons.TestUtils;

import CardTypeSwitcher from '../../../client/js/game/cardTypeSwitcher.jsx';

describe('CardTypeSwitcher Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(CardTypeSwitcher));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('cardTypeSwitcher');
    });

    it('should render a child for each CardType and append click handler to it', () => {
        shallowRenderer.render(React.createElement(CardTypeSwitcher));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual._store.props.children;
        expect(children.length).to.equal(Object.keys(CardType).length);
        expect(children[0]._store.props.children._store.props.onClick.__reactBoundMethod).to.equal(CardTypeSwitcher.prototype.changeCardType);
        expect(children[1]._store.props.children._store.props.onClick.__reactBoundMethod).to.equal(CardTypeSwitcher.prototype.changeCardType);
    });

});