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

        if (validationParameter.cardToPlay.type === validationParameter.color) {
            return validationSuccess;
        }

        let leadCard = validationParameter.tableCards[0];
        let hasTypeInHand = false;
        validationParameter.handCards.forEach(card => {
            if (card.type === leadCard.type) {
                hasTypeInHand = true;
            }
        });

        if (hasTypeInHand && validationParameter.cardToPlay.type !== leadCard.type) {
            return {
                permitted: false,
                message: 'You must play a card of the same color as the first one!'
            };
        }

        return validationSuccess;
    }
};

module.exports = AngebenValidator;