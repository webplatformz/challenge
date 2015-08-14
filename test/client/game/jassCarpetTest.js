'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import GameStore from '../../../client/js/game/gameStore';
import PlayerNames from '../../../client/js/game/playerNames.jsx';
import TableCards from '../../../client/js/game/tableCards.jsx';
import Trumpf from '../../../client/js/game/trumpf.jsx';

const TestUtils = React.addons.TestUtils;

import JassCarpet from '../../../client/js/game/jassCarpet.jsx';

describe('JassCarpet Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(JassCarpet));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('jassCarpet');
    });

    it('should render children', () => {
        shallowRenderer.render(React.createElement(JassCarpet));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual._store.props.children;
        expect(children.length).to.equal(3);
        expect(children[0].type).to.equal(PlayerNames);
        expect(children[1].type).to.equal(TableCards);
        expect(children[2].type).to.equal(Trumpf);
    });

    it('should pass correct props to PlayerNames', () => {
        let props = {
            players: ['player1'],
            playerSeating: ['playerSeating'],
            nextStartingPlayerIndex: 2
        };

        shallowRenderer.render(React.createElement(JassCarpet, props));
        let actual = shallowRenderer.getRenderOutput();

        let playerNames = actual._store.props.children[0];
        expect(playerNames._store.props.players).to.eql(props.players);
        expect(playerNames._store.props.playerSeating).to.eql(props.playerSeating);
        expect(playerNames._store.props.nextStartingPlayerIndex).to.equal(props.nextStartingPlayerIndex);
    });

    it('should pass correct props to TableCards', () => {
        let props = {
            cardType: GameStore.CardType.FRENCH,
            cards: ['card1'],
            startingPlayerIndex: 2,
            playerSeating: ['playerSeating']
        };

        shallowRenderer.render(React.createElement(JassCarpet, props));
        let actual = shallowRenderer.getRenderOutput();

        let tableCards = actual._store.props.children[1];
        expect(tableCards._store.props.cardType).to.equal(props.cardType);
        expect(tableCards._store.props.cards).to.eql(props.cards);
        expect(tableCards._store.props.startingPlayerIndex).to.equal(props.startingPlayerIndex);
        expect(tableCards._store.props.playerSeating).to.eql(props.playerSeating);
    });

    it('should pass correct props to Trumpf', () => {
        let props = {
            cardType: GameStore.CardType.FRENCH,
            mode: 'OBEABE',
            color: 'SPADES'
        };

        shallowRenderer.render(React.createElement(JassCarpet, props));
        let actual = shallowRenderer.getRenderOutput();

        let trumpf = actual._store.props.children[2];
        expect(trumpf._store.props.cardType).to.equal(props.cardType);
        expect(trumpf._store.props.mode).to.equal(props.mode);
        expect(trumpf._store.props.color).to.equal(props.color);
    });
});