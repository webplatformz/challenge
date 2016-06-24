'use strict';

import {expect} from 'chai';
import React from 'react';
import sinon from 'sinon';
import {CardType} from '../../../client/js/game/gameStore';
import JassActions from '../../../client/js/jassActions';
import {GameMode} from '../../../shared/game/gameMode';
import {CardColor} from '../../../shared/deck/cardColor';

import TestUtils from 'react-addons-test-utils';

import RequestTrumpf from '../../../client/js/game/requestTrumpf.jsx';

describe('RequestTrumpf Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    let chooseTrumpfSpy;

    beforeEach(() => {
        chooseTrumpfSpy = sinon.spy(JassActions, 'chooseTrumpf');
    });

    afterEach(() => {
        JassActions.chooseTrumpf.restore();
    });

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(RequestTrumpf));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('requestTrumpf');
    });

    it('should render Tags for each trumpf choice not geschoben with onClick handler', () => {
        let props = {
            isGeschoben: false
        };

        shallowRenderer.render(React.createElement(RequestTrumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children;
        expect(children).to.have.length(7);
        children[0].props.onClick();
        sinon.assert.calledWith(chooseTrumpfSpy, GameMode.TRUMPF, CardColor.HEARTS);
        children[1].props.onClick();
        sinon.assert.calledWith(chooseTrumpfSpy, GameMode.TRUMPF, CardColor.DIAMONDS);
        children[2].props.onClick();
        sinon.assert.calledWith(chooseTrumpfSpy, GameMode.TRUMPF, CardColor.CLUBS);
        children[3].props.onClick();
        sinon.assert.calledWith(chooseTrumpfSpy, GameMode.TRUMPF, CardColor.SPADES);
        children[4].props.onClick();
        sinon.assert.calledWith(chooseTrumpfSpy, GameMode.UNDEUFE);
        children[5].props.onClick();
        sinon.assert.calledWith(chooseTrumpfSpy, GameMode.OBEABE);
        children[6].props.onClick();
        sinon.assert.calledWith(chooseTrumpfSpy, GameMode.SCHIEBE);
        sinon.assert.callCount(chooseTrumpfSpy, 7);
    });

    it('should render on Tag less if geschoben', () => {
        let props = {
            isGeschoben: true
        };

        shallowRenderer.render(React.createElement(RequestTrumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children;
        expect(children).to.have.length(7);
        expect(children[6]).to.equal(undefined);
    });

    it('should change to given cardType', () => {
        let props = {
            cardType: CardType.GERMAN
        };

        shallowRenderer.render(React.createElement(RequestTrumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[0].props.src).to.contain(CardType.GERMAN);

        props.cardType = CardType.FRENCH;

        shallowRenderer.render(React.createElement(RequestTrumpf, props));
        actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[0].props.src).to.contain(CardType.FRENCH);
    });

    it('should bind the correct arguments to onClick handler', () => {
        let props = {
            isGeschoben: false
        };

        let heartSpy = chooseTrumpfSpy.withArgs(GameMode.TRUMPF, CardColor.HEARTS);
        let diamondsSpy = chooseTrumpfSpy.withArgs(GameMode.TRUMPF, CardColor.DIAMONDS);
        let clubsSpy = chooseTrumpfSpy.withArgs(GameMode.TRUMPF, CardColor.CLUBS);
        let spadesSpy = chooseTrumpfSpy.withArgs(GameMode.TRUMPF, CardColor.SPADES);
        let undeufeSpy = chooseTrumpfSpy.withArgs(GameMode.UNDEUFE);
        let obeabeSpy = chooseTrumpfSpy.withArgs(GameMode.OBEABE);
        let schiebeSpy = chooseTrumpfSpy.withArgs(GameMode.SCHIEBE);

        shallowRenderer.render(React.createElement(RequestTrumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children;
        children[0].props.onClick();
        children[1].props.onClick();
        children[2].props.onClick();
        children[3].props.onClick();
        children[4].props.onClick();
        children[5].props.onClick();
        children[6].props.onClick();
        sinon.assert.calledOnce(heartSpy);
        sinon.assert.calledOnce(diamondsSpy);
        sinon.assert.calledOnce(clubsSpy);
        sinon.assert.calledOnce(spadesSpy);
        sinon.assert.calledOnce(undeufeSpy);
        sinon.assert.calledOnce(obeabeSpy);
        sinon.assert.calledOnce(schiebeSpy);
        sinon.assert.callOrder(heartSpy, diamondsSpy, clubsSpy, spadesSpy, undeufeSpy, obeabeSpy, schiebeSpy);
    });

});