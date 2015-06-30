'use strict';
let _ = require('underscore');
let HandCardValidator = require('./hasCardValidator');

let Validation = {
    appendValidator: function appendValidator(validatorFn) {
        this.validators.push(validatorFn);
    },
    validate: function validateAll(tableCards, handCards, cardToPlay) {
        let success = true;
        this.validationParameters.tableCards = tableCards;
        this.validationParameters.handCards = handCards;
        this.validationParameters.cardToPlay = cardToPlay;

        for (let i = 0; i < this.validators.length; i++) {
            let validity = this.validators[i].validate(this.validationParameters);
            if (!validity.permitted) {
                console.log("Invalid: " + validity.message);
                return true;
                //this.errors.push(validity.message);
                //success = true; //TODO FIXME Enable Validation... don't forget :-)
            }
        }
        return success;
    }
};

let simpleCardValidator = {
    validate: function (validationParameter) {
        let validity = {
            permitted: false,
            message: 'simpleCardValidator: Farbe nicht erlaubt. Angeben ist möglich'
        };

        if (validationParameter.tableCards.length === 0) {
            validity.permitted = true;
            return validity;
        }

        let leadCardType = validationParameter.tableCards[0].type;
        let hasTypeInHand = false;
        validationParameter.handCards.forEach(card => {
            if (card.type === leadCardType.type) {
                hasTypeInHand = true;
            }
        });
        if (hasTypeInHand && validationParameter.cardToPlay.type !== leadCardType) {
            //check Trumpf
            return validity;
        }
        return validity;
    }
};

let create = function create(gameMode, trumpColor) {
    let validation = Object.create(Validation);
    validation.validators = [];
    validation.errors = [];
    validation.validationParameters = {
        mode: gameMode,
        color : trumpColor
    };
    validation.validators.push(HandCardValidator);
    validation.validators.push(simpleCardValidator);

    return validation;
};

module.exports = {
    create
};