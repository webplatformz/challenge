'use strict';

let Validation = {
    appendValidator: function appendValidator(validatorFn) {
        this.validators.push(validatorFn);
    },
    validate: function validateAll(){
        let success = true;
        for(let i = 0; i < this.validators.length; i++) {
            if (!this.validators[i].validate()){
                console.log("validator failed");
                success = false;
            }
        }
        return success;
    }
};

let simpleCardValidator = {
    validate : function(tableCards, handCards, handCardOne, mode, color){
        console.log("simple card validator is checking...");
        // TODO check if trumpf mode
        
        return true;
    }
};

let create = function create(mode, color) {
    let validation = Object.create(Validation);
    validation.mode = mode;
    validation.color = color;
    validation.validators = [];
    validation.validators.push(simpleCardValidator);    
    return validation;
};
//       let validation = Validation.create(GameMode.TRUMPF, Card.CardType.CLUBS);
        //assert(validation.validate(tableCards, handCards, handCardOne));

module.exports = {
    create
};