import {expect} from 'chai';
import React from 'react';
import {CardType} from '../../../client/js/game/gameStore';
import PlayerNames from '../../../client/js/game/playerNames.jsx';
import TableCards from '../../../client/js/game/tableCards.jsx';
import Trumpf from '../../../client/js/game/trumpf.jsx';

import TestUtils from 'react-addons-test-utils';

import JassCarpet from '../../../client/js/game/jassCarpet.jsx';

describe('JassCarpet Component', () => {

    const shallowRenderer = TestUtils.createRenderer();
    const minProps = {
        state: {
            chosenSession: 'someSession'
        }
    };

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(JassCarpet, minProps));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('jassCarpet');
    });

    it('should render children', () => {
        shallowRenderer.render(React.createElement(JassCarpet, minProps));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children;
        expect(children.length).to.equal(4);
        expect(children[0].type).to.equal(PlayerNames);
        expect(children[1].type).to.equal(TableCards);
        expect(children[2].type).to.equal(Trumpf);
    });

    it('should pass correct props to PlayerNames', () => {
        let props = {
            players: ['player1'],
            playerSeating: ['playerSeating'],
            nextStartingPlayerIndex: 2,
            roundPlayerIndex: 1,
            state: {
                chosenSession: 'someSession'
            }
        };

        shallowRenderer.render(React.createElement(JassCarpet, props));
        let actual = shallowRenderer.getRenderOutput();

        let playerNames = actual.props.children[0];
        expect(playerNames.props.players).to.eql(props.players);
        expect(playerNames.props.playerSeating).to.eql(props.playerSeating);
        expect(playerNames.props.nextStartingPlayerIndex).to.equal(props.nextStartingPlayerIndex);
        expect(playerNames.props.roundPlayerIndex).to.equal(props.roundPlayerIndex);
    });

    it('should pass correct props to TableCards', () => {
        let props = {
            cardType: CardType.FRENCH,
            cards: ['card1'],
            startingPlayerIndex: 2,
            playerSeating: ['playerSeating'],
            state: {
                chosenSession: 'someSession'
            }
        };

        shallowRenderer.render(React.createElement(JassCarpet, props));
        let actual = shallowRenderer.getRenderOutput();

        let tableCards = actual.props.children[1];
        expect(tableCards.props.cardType).to.equal(props.cardType);
        expect(tableCards.props.cards).to.eql(props.cards);
        expect(tableCards.props.startingPlayerIndex).to.equal(props.startingPlayerIndex);
        expect(tableCards.props.playerSeating).to.eql(props.playerSeating);
    });

    it('should pass correct props to Trumpf', () => {
        let props = {
            cardType: CardType.FRENCH,
            mode: 'OBEABE',
            color: 'SPADES',
            state: {
                chosenSession: 'someSession'
            }
        };

        shallowRenderer.render(React.createElement(JassCarpet, props));
        let actual = shallowRenderer.getRenderOutput();

        let trumpf = actual.props.children[2];
        expect(trumpf.props.cardType).to.equal(props.cardType);
        expect(trumpf.props.mode).to.equal(props.mode);
        expect(trumpf.props.color).to.equal(props.color);
    });
});