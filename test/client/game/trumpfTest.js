'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import {CardType} from '../../../client/js/game/gameStore';
import GameMode from '../../../shared/game/gameMode';
import {CardColor} from '../../../shared/deck/card';

const TestUtils = React.addons.TestUtils;

import Trumpf from '../../../client/js/game/trumpf.jsx';

describe('PlayerNames Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render an img element with className hidden without given mode', () => {
        shallowRenderer.render(React.createElement(Trumpf));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('img');
        expect(actual._store.props.id).to.equal('trumpf');
        expect(actual._store.props.className).to.equal('hidden');
    });

    it('should render an img element without className hidden with given mode trumpf and color hearts', () => {
        let props = {
            mode: GameMode.TRUMPF,
            color: CardColor.HEARTS,
            cardType: CardType.GERMAN
        };

        shallowRenderer.render(React.createElement(Trumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('img');
        expect(actual._store.props.id).to.equal('trumpf');
        expect(actual._store.props.className).to.equal('');
        expect(actual._store.props.src).to.equal('/images/trumpf/' + props.cardType + '/hearts.png');
    });

    it('should render an img element without className hidden with given mode trumpf and color diamonds', () => {
        let props = {
            mode: GameMode.TRUMPF,
            color: CardColor.DIAMONDS,
            cardType: CardType.GERMAN
        };

        shallowRenderer.render(React.createElement(Trumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('img');
        expect(actual._store.props.id).to.equal('trumpf');
        expect(actual._store.props.className).to.equal('');
        expect(actual._store.props.src).to.equal('/images/trumpf/' + props.cardType + '/diamonds.png');
    });

    it('should render an img element without className hidden with given mode trumpf and color clubs', () => {
        let props = {
            mode: GameMode.TRUMPF,
            color: CardColor.CLUBS,
            cardType: CardType.FRENCH
        };

        shallowRenderer.render(React.createElement(Trumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('img');
        expect(actual._store.props.id).to.equal('trumpf');
        expect(actual._store.props.className).to.equal('');
        expect(actual._store.props.src).to.equal('/images/trumpf/' + props.cardType + '/clubs.png');
    });

    it('should render an img element without className hidden with given mode trumpf and color spades', () => {
        let props = {
            mode: GameMode.TRUMPF,
            color: CardColor.SPADES,
            cardType: CardType.GERMAN
        };

        shallowRenderer.render(React.createElement(Trumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('img');
        expect(actual._store.props.id).to.equal('trumpf');
        expect(actual._store.props.className).to.equal('');
        expect(actual._store.props.src).to.equal('/images/trumpf/' + props.cardType + '/spades.png');
    });

    it('should render an img element without className hidden with given mode undeufe and no color', () => {
        let props = {
            mode: GameMode.UNDEUFE
        };

        shallowRenderer.render(React.createElement(Trumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('img');
        expect(actual._store.props.id).to.equal('trumpf');
        expect(actual._store.props.className).to.equal('');
        expect(actual._store.props.src).to.equal('/images/trumpf/undeufe.jpg');
    });

    it('should render an img element without className hidden with given mode obeabe and no color', () => {
        let props = {
            mode: GameMode.OBEABE
        };

        shallowRenderer.render(React.createElement(Trumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('img');
        expect(actual._store.props.id).to.equal('trumpf');
        expect(actual._store.props.className).to.equal('');
        expect(actual._store.props.src).to.equal('/images/trumpf/obeabe.jpg');
    });

    it('should render an img element without className hidden with given mode schiebe and no color', () => {
        let props = {
            mode: GameMode.SCHIEBE
        };

        shallowRenderer.render(React.createElement(Trumpf, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('img');
        expect(actual._store.props.id).to.equal('trumpf');
        expect(actual._store.props.className).to.equal('');
        expect(actual._store.props.src).to.equal('/images/trumpf/schiebe.jpg');
    });

});