import {GameMode} from '../gameMode';

let validationSuccess = {
    permitted: true
};

const AngebenValidator = {
    validate: function (validationParameter) {
        if (validationParameter.tableCards.length === 0) {
            return validationSuccess;
        }
        
        let hasOnlyBuur = function(handCards, leadColor, trumpfColor) {
            if(leadColor === trumpfColor && validationParameter.mode === GameMode.TRUMPF) {
                let trumpfCards = handCards.filter(function (card) {
                    return card.color === trumpfColor;
                });
                return trumpfCards.length === 1 && trumpfCards[0].number === 11;
            }
            return false;
        };

        if (validationParameter.cardToPlay.color === validationParameter.color) {
            return validationSuccess;
        }

        let leadCard = validationParameter.tableCards[0];
        let hasColorInHand = false;
        validationParameter.handCards.forEach(card => {
            if (card.color === leadCard.color) {
                hasColorInHand = true;
            }
        });

        if(hasColorInHand && hasOnlyBuur(validationParameter.handCards, leadCard.color, validationParameter.color)) {
            return validationSuccess;
        }

        if (hasColorInHand && validationParameter.cardToPlay.color !== leadCard.color) {
            return {
                permitted: false,
                message: 'You must play a card of the same color as the first one!'
            };
        }

        return validationSuccess;
    }
};

export default AngebenValidator;