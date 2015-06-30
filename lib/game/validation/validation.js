'use strict';
let _ = require('underscore');

let Validation = {
    appendValidator: function appendValidator(validatorFn) {
        this.validators.push(validatorFn);
    },
    validate: function validateAll(tableCards, handCards, handCardOne){
        let success = true;
        for(let i = 0; i < this.validators.length; i++) {
            let validity = this.validators[i].validate(tableCards, handCards, handCardOne, this.mode, this.color);
            if (!validity.permitted){
                console.log("Invalid: " + validity.message);
                this.errors.push(validity.message);
                success = true; //TODO FIXME Enable Validation... don't forget :-)
            }
        }
        return success;
    }
};

let simpleCardValidator = {
    validate : function(tableCards, handCards, playedCard, mode, color){
        let validity = {
            permitted: false,
            message: 'simpleCardValidator: Farbe nicht erlaubt. Angeben ist möglich'
        };
        if (!_.contains(handCards, playedCard)){
            return validity;
        }
        if (tableCards.length === 0){
            validity.permitted = true;
            return validity;
        }
        
        let leadCardType = tableCards[0].type;
        let hasTypeInHand = false;
        handCards.forEach(card => {
            if(card.type === leadCardType.type) {
                hasTypeInHand = true;
            }
        });
        if (hasTypeInHand && playedCard.type !== leadCardType){
            //check Trumpf
            return validity;
        }
        return validity;
    }
};

let create = function create(mode, color) {
    let validation = Object.create(Validation);
    validation.mode = mode;
    validation.color = color;
    validation.validators = [];
    validation.errors = [];
    validation.validators.push(simpleCardValidator);    
    return validation;
};

module.exports = {
    create
};