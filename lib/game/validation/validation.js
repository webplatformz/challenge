'use strict';

let Validation = {
    appendValidator: function appendValidator(validatorFn) {
        this.validators.push(validatorFn);
    },
    validate: function validateAll(){
        let success = true;
        for(let i = 0; i < this.validators.length; i++) {
            if (!this.validators[i].validate()){
                success = false;
            }
        }
        return success;
    }
};

let create = function create() {
    let validation = Object.create(Validation);
    validation.validators = [];
    return validation;
};

module.exports = {
    create
};