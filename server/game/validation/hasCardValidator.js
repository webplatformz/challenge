'use strict';
let _ = require('underscore');


let HasCardValidator = {
    validate: function (validationParameter) {
        if (!_.contains(validationParameter.handCards, validationParameter.cardToPlay)) {
            return {
                permitted: false,
                message: 'HasCardValidator: Card is not in your hand, bitch, read the fucking göpfeck rules!!'
            };
        } else {
            return {
                permitted: true
            };
        }

    }
};

module.exports = HasCardValidator;