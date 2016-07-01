import {GameMode} from '../gameMode';

let validationSuccess = {
    permitted: true
};

const UnderTrumpfValidator = {
    validate (validationParameter) {
        let trumpfQuantifier = [6,7,8,10,12,13,14,9,11]; 
        let trumpfColor = validationParameter.color;
        
        if (validationParameter.tableCards.length === 0 || validationParameter.mode !== GameMode.TRUMPF) {
            return validationSuccess;
        }
        
        if (validationParameter.cardToPlay.color !== trumpfColor) {
            return validationSuccess;
        }

        var firstCardColor = validationParameter.tableCards[0].color;
        if(firstCardColor === trumpfColor) {
            return validationSuccess;
        }
        
        let hasOtherThanTrumpf = validationParameter.handCards.some(card => card.color !== trumpfColor);

        if (!hasOtherThanTrumpf){
            return validationSuccess;
        }
        
        let highestTrumpfOnTableIndex = -1;
        let cardTrumpfIndex = trumpfQuantifier.indexOf(validationParameter.cardToPlay.number);
        validationParameter.tableCards.forEach(card => {
            if (card.color === trumpfColor){
                highestTrumpfOnTableIndex = Math.max(highestTrumpfOnTableIndex, trumpfQuantifier.indexOf(card.number)); 
            }            
        });
        
        if (cardTrumpfIndex < highestTrumpfOnTableIndex) {
            return {
                permitted: false,
                message: 'UnderTrumpfValidator: Undetrumpf is not allowed!'
            }; 
        }
        
        return validationSuccess;
    }
};

export default UnderTrumpfValidator;