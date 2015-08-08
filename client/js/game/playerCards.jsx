'use strict';

let React = require('react'),
    CardColor = require('../../../shared/deck/card').CardColor,
    GameState = require('./gameStore').GameState,
    JassActions = require('../jassActions');

let colorIndices = {};

Object.getOwnPropertyNames(CardColor).forEach((color, index) => {
    colorIndices[color] = index;
});

module.exports = React.createClass({

    playCard: function (color, number) {
        JassActions.chooseCard(color, number);
    },

    cancelClick: function (color, number, event) {
        event.preventDefault();
    },

    render: function () {
        let cards = this.props.cards || [],
            isRequestingCard = this.props.state === GameState.REQUESTING_CARD,
            cardClick = (isRequestingCard) ? this.playCard : this.cancelClick;

        return (
            <div id="playerCards" className={(isRequestingCard) ? 'onTurn' : ''}>
                {cards.sort((a, b) => {
                    if (a.color !== b.color) {
                        return colorIndices[a.color] - colorIndices[b.color];
                    }

                    return colorIndices[a.color] - colorIndices[b.color] + a.number - b.number;
                }).map((card) => {
                    return (
                        <img key={card.color + '-' + card.number} src={'/images/cards/' + this.props.cardType + '/' + card.color + '_' + card.number + '.gif'}
                            onClick={cardClick.bind(null, card.color, card.number)} />);
                })}
            </div>
        );
    }
});
