'use strict';
let _ = require('underscore');

let HasCardValidator = {
    validate: function (validationParameter) {
        let cardToPlay = function(cardToPlay, handCard) {
            return cardToPlay.number === handCard.number && cardToPlay.color === handCard.color;
        };

        if (validationParameter.handCards.some(cardToPlay.bind(null, validationParameter.cardToPlay))) {
            return {
                permitted: true
            };
        } else {
            console.log('handc{ards: ' + JSON.stringify(validationParameter.handCards) + ' cardtoplay: ' + JSON.stringify(validationParameter.cardToPlay));

            return {
                permitted: false,
                message: 'HasCardValidator: Card is not in your hand, bitch, read the fucking göpfeck rules!!'
            };
        }

    }
};

module.exports = HasCardValidator;