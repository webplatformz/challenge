'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import sinon from 'sinon';
import GameStore from '../../../client/js/game/gameStore';
import {CardColor} from '../../../shared/deck/card';
import JassActions from '../../../client/js/jassActions';

const TestUtils = React.addons.TestUtils;

import PlayerCards from '../../../client/js/game/playerCards.jsx';

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
        expect(actual._store.props.id).to.equal('playerCards');
        expect(actual._store.props.className).to.equal('');
    });

    it('should add class onTurn when requesting card', () => {
        let props = {
            state: GameStore.GameState.REQUESTING_CARD
        };

        shallowRenderer.render(React.createElement(PlayerCards, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual._store.props.className).to.equal('onTurn');
    });

    it('should render cards sorted by color (according to Object Property order in CardColor) and number', () => {
        let props = {
                cardType: GameStore.CardType.FRENCH,
                cards: [
                    {
                        color: CardColor.DIAMONDS,
                        number: 9
                    },
                    {
                        color: CardColor.HEARTS,
                        number: 7
                    },
                    {
                        color: CardColor.SPADES,
                        number: 14
                    },
                    {
                        color: CardColor.HEARTS,
                        number: 6
                    },
                    {
                        color: CardColor.CLUBS,
                        number: 11
                    }
                ],
                state: GameStore.GameState.REQUESTING_CARD
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

        actual._store.props.children.forEach((actCard, index) => {
            let expectedCard = sortedCards[index];

            expect(actCard.key).to.equal(expectedCard.color + '-' + expectedCard.number);
            expect(actCard._store.props.src).to.equal('/images/cards/' + GameStore.CardType.FRENCH + '/' + expectedCard.color.toLowerCase() + '_' + expectedCard.number + '.gif');
            expect(actCard._store.props.onClick.__reactBoundMethod).to.equal(PlayerCards.prototype.playCard);
        });
    });

    it('should append cancelClick handler to cards when not requesting card', () => {
        let props = {
                cards: [
                    {
                        color: CardColor.DIAMONDS,
                        number: 9
                    }
                ]
            },
            eventDummy = {
                preventDefault: function() {}
            },
            preventDefaultSpy = sinon.spy(eventDummy, 'preventDefault');

        shallowRenderer.render(React.createElement(PlayerCards, props));
        let actual = shallowRenderer.getRenderOutput();

        let cancelClickFunction = actual._store.props.children[0]._store.props.onClick;
        expect(cancelClickFunction.__reactBoundMethod).to.equal(PlayerCards.prototype.cancelClick);
        cancelClickFunction(eventDummy);
        expect(preventDefaultSpy.calledOnce).to.equal(true);
    });

    it('should append playCard handler to cards when requesting card', () => {
        let props = {
                cards: [
                    {
                        color: CardColor.HEARTS,
                        number: 8
                    }
                ],

                state: GameStore.GameState.REQUESTING_CARD
            };

        shallowRenderer.render(React.createElement(PlayerCards, props));
        let actual = shallowRenderer.getRenderOutput();

        let playCardFunction = actual._store.props.children[0]._store.props.onClick;
        expect(playCardFunction.__reactBoundMethod).to.equal(PlayerCards.prototype.playCard);
        playCardFunction();
        expect(chooseCardSpy.withArgs(props.cards[0].color, props.cards[0].number).calledOnce).to.equal(true);
    });

});