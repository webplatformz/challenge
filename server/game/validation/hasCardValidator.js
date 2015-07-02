'use strict';
let _ = require('underscore');

let HasCardValidator = {
    validate: function (validationParameter) {
        let cardToPlay = function(cardToPlay, handCard) {
            return handCard.equals(cardToPlay);
        };

        if (validationParameter.handCards.some(cardToPlay.bind(null, validationParameter.cardToPlay))) {
            return {
                permitted: true
            };
        } else {
            return {
                permitted: false,
                message: 'HasCardValidator: Card is not in your hand!'
            };
        }

    }
};

module.exports = HasCardValidator;