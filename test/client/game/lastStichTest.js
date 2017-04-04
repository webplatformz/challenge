import {expect} from 'chai';
import React from 'react';
import * as Card from '../../../shared/deck/card';
import {CardColor} from '../../../shared/deck/cardColor';

import TestUtils from 'react-addons-test-utils';

import LastStich from '../../../client/js/game/lastStich.jsx';
import {GameState} from '../../../client/js/game/gameStore';
import JassActions from '../../../client/js/jassActions';
import sinon from 'sinon';

describe('LastStich Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    let toggleSpy;

    beforeEach(() => {
        toggleSpy = sinon.spy(JassActions, 'toggleShowLastStich');
    });

    afterEach(() => {
        JassActions.toggleShowLastStich.restore();
    });

    it('should render a div element with id', () => {
      const props = {
          cards: []
      };
      shallowRenderer.render(React.createElement(LastStich, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('lastStich');
    });

    it('should have class hidden when not 4 cards are on table ', () => {
        let props = {
            cards : []
        };
        shallowRenderer.render(React.createElement(LastStich, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('lastStich');
        expect(actual.props.className).to.equal('hidden');
    });

    it('should not have class hidden when 4 cards are on table ', () => {
        let props = {
            state: GameState.STICH,
            startingPlayerIndex: 0,
            playerSeating: ['a','b','c','d'],
            cards : [
                Card.create(9, CardColor.CLUBS),
                Card.create(10, CardColor.CLUBS),
                Card.create(11, CardColor.CLUBS),
                Card.create(12, CardColor.CLUBS)
            ]
        };
        shallowRenderer.render(React.createElement(LastStich, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('lastStich');
        expect(actual.props.className).to.equal('');
        expect(actual.props.children[0].type).to.equal('img');
    });

    it('should toggle display onclick', () => {
        let props = {
            state: GameState.STICH,
            startingPlayerIndex: 0,
            playerSeating: ['a','b','c','d'],
            cards : [
                Card.create(9, CardColor.CLUBS),
                Card.create(10, CardColor.CLUBS),
                Card.create(11, CardColor.CLUBS),
                Card.create(12, CardColor.CLUBS)
            ]
        };
        shallowRenderer.render(React.createElement(LastStich, props));
        let actual = shallowRenderer.getRenderOutput();

        const deckClick = actual.props.children[0].props.onClick;
        expect(deckClick).to.be.a('function');
        deckClick();
        sinon.assert.calledOnce(toggleSpy);

        const closeClick = actual.props.children[1].props.children[0].props.onClick;
        expect(closeClick).to.be.a('function');
        closeClick();
        sinon.assert.calledTwice(toggleSpy);
    });

});