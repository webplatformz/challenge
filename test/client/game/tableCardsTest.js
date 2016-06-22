'use strict';

import {expect} from 'chai';
import React from 'react';
import {CardType} from '../../../client/js/game/gameStore';
import {CardColor} from '../../../shared/deck/cardColor';

import TestUtils from 'react-addons-test-utils';
import CollectStichHint from '../../../client/js/game/collectStichHint.jsx';

import TableCards from '../../../client/js/game/tableCards.jsx';
import sinon from 'sinon';
import {GameState} from "../../../client/js/game/gameStore";

describe('PlayerNames Component', () => {

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
            cardType: CardType.GERMAN
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
            collectStich: true
        };

        const renderSpy = sinon.spy(TableCards.prototype, 'render');
        shallowRenderer.render(React.createElement(TableCards, props));
        sinon.assert.callCount(renderSpy, 1); // shouldComponentUpdate will not be called on first render

        props.collectStich = false;
        shallowRenderer.render(React.createElement(TableCards, props));
        sinon.assert.callCount(renderSpy, 1);

        props.collectStich = true;
        shallowRenderer.render(React.createElement(TableCards, props));
        sinon.assert.callCount(renderSpy, 2);
    });

    it('should render CollectStichHint when state is Stich', () => {
        let props = {
            state: GameState.STICH
        };

        let actual = shallowRenderer.render(React.createElement(TableCards, props));
        expect(actual.props.children[0].type).to.equal(CollectStichHint);
    });

    it('should not render CollectStichHint when state is other than Stich', () => {
        let props = {
            state: "EverythingElseThanGameStateStich"
        };

        let actual = shallowRenderer.render(React.createElement(TableCards, props));
        expect(actual.props.children[0]).to.equal(undefined);
    });

});