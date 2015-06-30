'use strict';
let _ = require('underscore');
let HandCardValidator = require('./hasCardValidator');
let AngebenValidator = require('./angebenValidator');

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


let create = function create(gameMode, trumpColor) {
    let validation = Object.create(Validation);
    validation.validators = [];
    validation.errors = [];
    validation.validationParameters = {
        mode: gameMode,
        color : trumpColor
    };

    validation.validators.push(HandCardValidator);
    validation.validators.push(AngebenValidator);

    return validation;
};

module.exports = {
    create
};