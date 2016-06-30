import HandCardValidator from './hasCardValidator';
import AngebenValidator from './angebenValidator';
import UnderTrumpfValidator from './underTrumpfValidator';

const Validation = {
    validate (tableCards, handCards, cardToPlay) {
        let success = true;
        if (tableCards.length === 4) {
            return success;
        }
        this.validationParameters.tableCards = tableCards;
        this.validationParameters.handCards = handCards;
        this.validationParameters.cardToPlay = cardToPlay;

        return this.validators.every(validator => validator.validate(this.validationParameters).permitted);
    }
};


export default {
    create (gameMode, trumpColor) {
        let validation = Object.create(Validation);
        validation.validators = [];
        validation.errors = [];
        validation.validationParameters = {
            mode: gameMode,
            color: trumpColor
        };

        validation.validators.push(HandCardValidator);
        validation.validators.push(AngebenValidator);
        validation.validators.push(UnderTrumpfValidator);
        return validation;
    }
};