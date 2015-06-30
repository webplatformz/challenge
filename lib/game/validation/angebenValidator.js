'use strict';
let _ = require('underscore');
let Game = require('../game');

let AngebenValidator = {
    validate: function (validationParameter) {

        if (validationParameter.tableCards.length === 0) {
            return {
                permitted: true
            };
        }

        if(validationParameter.cardToPlay.type === validationParameter.color.type) {
            return {
                permitted: true
            };
        }

        let leadCardType = validationParameter.tableCards[0].type;
        let hasTypeInHand = false;
        validationParameter.handCards.forEach(card => {
            if (card.type === leadCardType.type) {
                hasTypeInHand = true;
            }
        });
        if (hasTypeInHand && validationParameter.cardToPlay.type !== leadCardType) {
            return {
                permitted : false,
                message : 'You must play a card of the same color as the first one!'
            };
        }
    }
};

module.exports = AngebenValidator;