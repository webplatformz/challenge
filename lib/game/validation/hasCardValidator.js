'use strict';
let _ = require('underscore');


let HasCardValidator = {
    validate: function (validationParameter) {
        let contains = function(handCards, cardToPlay) {
            let cardFound = false;
            let cardToPlayAsString = JSON.stringify(cardToPlay);
            handCards.forEach((card) => {
                if(JSON.stringify(card) === cardToPlayAsString) {
                    cardFound = true;
                }
            });

            return cardFound;
        };

        if (contains(validationParameter.handCards, validationParameter.cardToPlay)) {
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