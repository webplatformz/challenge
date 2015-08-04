'use strict';

let React = require('react');

module.exports = React.createClass({

    playCard: function(color, number) {
        //TODO send choose card to server
    },

    render: function () {
        let cards = this.props.cards || [];

        return (
            <div id="playerCards">
                {cards.map(function(card) {
                    return (
                        <img src={'/images/cards/french/' + card.color + '_' + card.number + '.gif'}
                            onClick={this.playCard(card.color, card.number)} />);
                }.bind(this))}
            </div>
        );
    }
});
