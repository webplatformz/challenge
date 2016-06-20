'use strict';

import React from 'react';
import {CardColor} from '../../../shared/deck/cardColor';
import {GameState} from './gameStore.js';
import JassActions from '../jassActions.js';
import Validation from '../../../shared/game/validation/validation';

let colorIndices = {};

Object.getOwnPropertyNames(CardColor).forEach((color, index) => {
    colorIndices[color] = index;
});

export default React.createClass({

    playCard: function (color, number) {
        JassActions.chooseCard(color, number);
    },

    cancelClick: function (color, number, event) {
        event.preventDefault();
    },

    render: function () {
        const cards = this.props.cards || [],
            isRequestingCard = this.props.state === GameState.REQUESTING_CARD,
            tableCards = this.props.tableCards || [],
            mode = this.props.mode,
            color = this.props.color,
            cardClick = (isRequestingCard) ? this.playCard : this.cancelClick;

        const validator = Validation.create(mode, color);

        return (
            <div id="playerCards" className={(isRequestingCard) ? 'onTurn' : ''}>
                {cards.sort((a, b) => {
                    if (a.color !== b.color) {
                        return colorIndices[a.color] - colorIndices[b.color];
                    }

                    return colorIndices[a.color] - colorIndices[b.color] + a.number - b.number;
                }).map((card) => {
                    const isValid = validator.validate(tableCards, cards, card);
                    return (
                        <img key={card.color + '-' + card.number}
                             src={'/images/cards/' + this.props.cardType + '/' + card.color.toLowerCase() + '_' + card.number + '.gif'}
                             onClick={(isValid)?cardClick.bind(null, card.color, card.number):undefined}
                             className={(isValid)? '' : 'invalid'}/>);
                })}
            </div>
        );
    }
});
