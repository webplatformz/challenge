'use strict';

let React = require('react');

module.exports = React.createClass({

    render: function () {
        let cards = this.props.cards || [],
            startingPlayerIndex = this.props.startingPlayerIndex,
            playerSeating = this.props.playerSeating,
            imagePath = '/images/cards/' + this.props.cardType + '/';

        return (
            <div id="tableCards">
                {cards.map((card, index) => {
                    let actPlayerIndex = (startingPlayerIndex + index) % 4;
                    return (
                        <img key={card.color + '_' + card.number} className={'card-' + playerSeating[actPlayerIndex]} src={imagePath + card.color.toLowerCase() + '_' + card.number + '.gif'} />
                    );
                })}
            </div>
        );
    }
});
