'use strict';

let React = require('react'),
    CardColor = require('../../../shared/deck/card').CardColor;

let colorIndices = {};

Object.getOwnPropertyNames(CardColor).forEach((color, index) => {
    colorIndices[color] = index;
});

console.log(colorIndices);

module.exports = React.createClass({

    playCard: function(color, number) {

    },

    render: function () {
        let cards = this.props.cards || [];

        return (
            <div id="playerCards">
                {cards.sort((a, b) => {
                    if (a.color !== b.color) {
                        return colorIndices[a.color] - colorIndices[b.color];
                    }

                    return a.number - b.number;
                }).map((card) => {
                    return (
                        <img key={card.color + '-' + card.number} src={'/images/cards/' + this.props.cardType + '/' + card.color + '_' + card.number + '.gif'}
                            onClick={this.playCard(card.color, card.number)} />);
                })}
            </div>
        );
    }
});
