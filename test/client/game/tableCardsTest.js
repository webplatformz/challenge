'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import {CardType} from '../../../client/js/game/gameStore';
import {CardColor} from '../../../shared/deck/card';

const TestUtils = React.addons.TestUtils;

import TableCards from '../../../client/js/game/tableCards.jsx';

describe('PlayerNames Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(TableCards));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('tableCards');
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
            cardType: CardType.GERMAN
        };

        shallowRenderer.render(React.createElement(TableCards, props));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual._store.props.children;
        expect(children).to.have.length(3);
        children.forEach((actCard, index) => {
            let expectedCard = props.cards[index];
            expect(actCard.key).to.equal(expectedCard.color + '_' + expectedCard.number);
            expect(actCard._store.props.className).to.equal('card-' + props.playerSeating[(props.startingPlayerIndex + index) % 4]);
            expect(actCard._store.props.src).to.equal('/images/cards/' + props.cardType + '/' + expectedCard.color.toLowerCase() + '_' + expectedCard.number + '.gif');
        });
    });

});