'use strict';
let _ = require('underscore');

let validationSuccess = {
    permitted: true
};

let AngebenValidator = {
    validate: function (validationParameter) {

        if (validationParameter.tableCards.length === 0) {
            return validationSuccess;
        }

        if (validationParameter.cardToPlay.color === validationParameter.color) {
            return validationSuccess;
        }

        let leadCard = validationParameter.tableCards[0];
        let hasColorInHand = false;
        validationParameter.handCards.forEach(card => {
            if (card.color === leadCard.color) {
                hasColorInHand = true;
            }
        });

        if (hasColorInHand && validationParameter.cardToPlay.color !== leadCard.color) {
            return {
                permitted: false,
                message: 'You must play a card of the same color as the first one!'
            };
        }

        return validationSuccess;
    }
};

module.exports = AngebenValidator;