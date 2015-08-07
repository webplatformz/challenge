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
                        id = 'cardType-' + cardType,
                        imagePath = '/images/trumpf/' + cardType;

                    return (
                        <div>
                            <input id={id} type="radio" name="cardType" onClick={this.changeCardType.bind(null, cardType)} />
                            <label htmlFor={id}>
                                <img src={imagePath + '/hearts.png'} />
                                <img src={imagePath + '/diamonds.png'} />
                                <img src={imagePath + '/clubs.png'} />
                                <img src={imagePath + '/spades.png'} />
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    }
});
