'use strict';

import {expect} from 'chai';
import React from 'react';
import sinon from 'sinon';
import {GameState, CardType} from '../../../client/js/game/gameStore';
import {CardColor} from '../../../shared/deck/cardColor';
import * as Card from '../../../shared/deck/card';
import JassActions from '../../../client/js/jassActions';

import TestUtils from 'react-addons-test-utils';

import PlayerCards from '../../../client/js/game/playerCards.jsx';
import {GameMode} from "../../../shared/game/gameMode";

describe('PlayerCards Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    let chooseCardSpy;

    beforeEach(() => {
        chooseCardSpy = sinon.spy(JassActions, 'chooseCard');
    });

    afterEach(() => {
        JassActions.chooseCard.restore();
    });

    it('should render a div element with id and no class when not requesting card', () => {
        shallowRenderer.render(React.createElement(PlayerCards));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('playerCards');
        expect(actual.props.className).to.equal('');
    });

    it('should add class onTurn when requesting card', () => {
        let props = {
            state: GameState.REQUESTING_CARD
        };

        shallowRenderer.render(React.createElement(PlayerCards, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.className).to.equal('onTurn');
    });

    it('should render cards sorted by color (according to Object Property order in CardColor) and number', () => {
        let props = {
                cardType: CardType.FRENCH,
                cards: [
                    Card.create(9, CardColor.DIAMONDS),
                    Card.create(7, CardColor.HEARTS),
                    Card.create(14, CardColor.SPADES),
                    Card.create(6, CardColor.HEARTS),
                    Card.create(11, CardColor.CLUBS)
                ],
                state: GameState.REQUESTING_CARD
            },
            sortedCards = [
                {
                    color: CardColor.HEARTS,
                    number: 6
                },
                {
                    color: CardColor.HEARTS,
                    number: 7
                },
                {
                    color: CardColor.DIAMONDS,
                    number: 9
                },
                {
                    color: CardColor.CLUBS,
                    number: 11
                },
                {
                    color: CardColor.SPADES,
                    number: 14
                }
            ];

        shallowRenderer.render(React.createElement(PlayerCards, props));
        let actual = shallowRenderer.getRenderOutput();

        actual.props.children.forEach((actCard, index) => {
            let expectedCard = sortedCards[index];

            expect(actCard.key).to.equal(expectedCard.color + '-' + expectedCard.number);
            expect(actCard.props.src).to.equal('/images/cards/' + CardType.FRENCH + '/' + expectedCard.color.toLowerCase() + '_' + expectedCard.number + '.gif');
            expect(actCard.props.onClick.__reactBoundMethod).to.equal(PlayerCards.prototype.playCard);
        });
    });

    it('should append cancelClick handler to cards when not requesting card', () => {
        let props = {
                cards: [
                    Card.create(9, CardColor.DIAMONDS)
                ]
            },
            eventDummy = {
                preventDefault: function () {
                }
            },
            preventDefaultSpy = sinon.spy(eventDummy, 'preventDefault');

        shallowRenderer.render(React.createElement(PlayerCards, props));
        let actual = shallowRenderer.getRenderOutput();

        let cancelClickFunction = actual.props.children[0].props.onClick;
        expect(cancelClickFunction.__reactBoundMethod).to.equal(PlayerCards.prototype.cancelClick);
        cancelClickFunction(eventDummy);
        sinon.assert.callCount(preventDefaultSpy, 1);
    });

    it('should append playCard handler to cards when requesting card', () => {
        let props = {
            cards: [
                Card.create(8,CardColor.HEARTS )
            ],

            state: GameState.REQUESTING_CARD
        };

        shallowRenderer.render(React.createElement(PlayerCards, props));
        let actual = shallowRenderer.getRenderOutput();

        let playCardFunction = actual.props.children[0].props.onClick;
        expect(playCardFunction.__reactBoundMethod).to.equal(PlayerCards.prototype.playCard);
        playCardFunction();
        sinon.assert.calledWith(chooseCardSpy, props.cards[0].color, props.cards[0].number);
    });

    it('should set invalid class when card is not playable', () => {
        let props = {
            cards: [
                Card.create(8, CardColor.HEARTS),
                Card.create(8, CardColor.DIAMONDS)
            ],
            mode: GameMode.TRUMPF,
            color: CardColor.HEARTS,
            tableCards: [
                Card.create(9, CardColor.HEARTS)
            ],
            state: GameState.REQUESTING_CARD
        };

        shallowRenderer.render(React.createElement(PlayerCards, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[0].props.className).to.equal('');
        expect(actual.props.children[1].props.className).to.equal('invalid');
    });

    it('should not set invalid class when state not REQUESTING_CARD', () => {
        let props = {
            cards: [
                Card.create(8, CardColor.HEARTS),
                Card.create(8, CardColor.DIAMONDS)
            ],
            mode: GameMode.TRUMPF,
            color: CardColor.HEARTS,
            tableCards: [
                Card.create(9, CardColor.HEARTS)
            ],
            state: GameState.REQUESTING_TRUMPF
        };

        shallowRenderer.render(React.createElement(PlayerCards, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[0].props.className).to.equal('');
        expect(actual.props.children[1].props.className).to.equal('');
    });

});