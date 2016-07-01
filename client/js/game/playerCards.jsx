import React from 'react';
import {CardColor} from '../../../shared/deck/cardColor';
import {GameState} from './gameStore';
import JassActions from '../jassActions';
import Validation from '../../../shared/game/validation/validation';

let colorIndices = {};

Object.getOwnPropertyNames(CardColor).forEach((color, index) => {
    colorIndices[color] = index;
});

function playCard(color, number) {
    JassActions.chooseCard(color, number);
}

function cancelClick(color, number, event) {
    event.preventDefault();
}

export default (props) => {
    
    const cards = props.cards || [],
        isRequestingCard = props.state === GameState.REQUESTING_CARD,
        tableCards = props.tableCards || [],
        mode = props.mode,
        color = props.color,
        cardClick = (isRequestingCard) ? playCard : cancelClick;

    const validator = Validation.create(mode, color);

    return (
        <div id="playerCards" className={(isRequestingCard) ? 'onTurn' : ''}>
            {cards.sort((a, b) => {
                if (a.color !== b.color) {
                    return colorIndices[a.color] - colorIndices[b.color];
                }

                return colorIndices[a.color] - colorIndices[b.color] + a.number - b.number;
            }).map((card) => {
                const isValid = isRequestingCard ? validator.validate(tableCards, cards, card) : true;
                return (
                    <img key={card.color + '-' + card.number}
                         src={'/images/cards/' + props.cardType + '/' + card.color.toLowerCase() + '_' + card.number + '.gif'}
                         onClick={(event) => cardClick(card.color, card.number, event)}
                         className={(isValid) ? '' : 'invalid'}
                    />);
            })}
        </div>
    );
};
