'use strict';

let React = require('react'),
    CardType = require('./gameStore').CardType,
    JassActions = require('../jassActions');

module.exports = React.createClass({

    changeCardType: function(cardType) {
        JassActions.changeCardType(cardType);
    },

    render: function () {
        return (
            <div id="cardTypeSwitcher">
                {Object.getOwnPropertyNames(CardType).map((cardTypeKey) => {
                    let cardType = CardType[cardTypeKey],
                        imagePath = '/images/trumpf/' + cardType;

                    return (
                        <div>
                            <a onClick={this.changeCardType.bind(null, cardType)}>
                                <img src={imagePath + '/hearts.png'} />
                                <img src={imagePath + '/diamonds.png'} />
                                <img src={imagePath + '/clubs.png'} />
                                <img src={imagePath + '/spades.png'} />
                            </a>
                        </div>
                    );
                })}
            </div>
        );
    }
});
