'use strict';

import {expect} from 'chai';
import React from 'react';
import {CardType} from '../../../client/js/game/gameStore';
import * as Card from '../../../shared/deck/card';
import {CardColor} from '../../../shared/deck/cardColor';

import TestUtils from 'react-addons-test-utils';
import CollectStichHint from '../../../client/js/game/collectStichHint.jsx';

import TableCards from '../../../client/js/game/tableCards.jsx';

describe.only('PlayerNames Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(TableCards));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('tableCards');
    });

    it('should render elements for each card with correct class and src attribute', () => {
        let props = {
            cards: [
                {
                    color: CardColor.HEARTS,
                    number: 9
                },
                {
                    color: CardColor.SPADES,
                    number: 4
                },
                {
                    color: CardColor.HEARTS,
                    number: 10
                }
            ],
            startingPlayerIndex: 2,
            playerSeating: [
                'top',
                'right',
                'bottom',
                'left'
            ],
            cardType: CardType.GERMAN,
            collectStich: true
        };

        shallowRenderer.render(React.createElement(TableCards, props));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children[1];
        expect(children).to.have.length(3);
        children.forEach((actCard, index) => {
            let expectedCard = props.cards[index];
            expect(actCard.key).to.equal(expectedCard.color + '_' + expectedCard.number);
            expect(actCard.props.className).to.equal('card-' + props.playerSeating[(props.startingPlayerIndex + index) % 4]);
            expect(actCard.props.src).to.equal('/images/cards/' + props.cardType + '/' + expectedCard.color.toLowerCase() + '_' + expectedCard.number + '.gif');
        });
    });

    it('should not update when stich is not yet collected', () => {
        let props = {
            collectStich: true,
            cards : [Card.create(9, CardColor.CLUBS), Card.create(10, CardColor.CLUBS),Card.create(11, CardColor.CLUBS),Card.create(12, CardColor.CLUBS)],
            startingPlayerIndex:0,
            playerSeating: ['a','b','c','d']
        };

        let renderedElement = shallowRenderer.render(React.createElement(TableCards, props));
        expect(renderedElement.props.children[1].length).to.equal(4);

        props.collectStich = false;
        props.cards = [];
        renderedElement = shallowRenderer.render(React.createElement(TableCards, props));
        expect(renderedElement.props.children[1].length).to.equal(4);

        props.collectStich = true;
        renderedElement = shallowRenderer.render(React.createElement(TableCards, props));
        expect(renderedElement.props.children[1].length).to.equal(0);
    });

    it('should render CollectStichHint when collectStich is false', () => {
        let props = {
            collectStich: false
        };

        let actual = shallowRenderer.render(React.createElement(TableCards, props));
        expect(actual.props.children[0].type).to.equal(CollectStichHint);
    });

    it('should not render CollectStichHint when collectStich is not equal false', () => {
        let props = {};

        let actual = shallowRenderer.render(React.createElement(TableCards, props));
        expect(actual.props.children[0]).to.equal(undefined);
    });

});
