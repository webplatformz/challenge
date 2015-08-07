'use strict';

let React = require('react');

module.exports = React.createClass({

    playCard: function(color, number) {

    },

    render: function () {
        let cards = this.props.cards || [];

        return (
            <div id="playerCards">
                {cards.map(function(card) {
                    return (
                        <img key={card.color + '-' + card.number} src={'/images/cards/' + this.props.cardType + '/' + card.color + '_' + card.number + '.gif'}
                            onClick={this.playCard(card.color, card.number)} />);
                }.bind(this))}
            </div>
        );
    }
});
