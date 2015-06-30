'use strict';
let _ = require('underscore');


let UnderTrumpfValidator = {    
    validate: function (validationParameter) {
        let trumpfQuantifier = [6,7,8,10,12,13,14,9,11]; 
        let trumpfColor = validationParameter.color;
        
        if (validationParameter.tableCards.length === 0) {
            return {
                permitted: true
            };
        }
        
        if (validationParameter.cardToPlay.type !== trumpfColor) {
            return {
                permitted: true
            };
        }
        let highestTrumpfOnTableIndex = -1;
        let cardTrumpfIndex = trumpfQuantifier.indexOf(validationParameter.cardToPlay.number);
        let leadType = validationParameter.tableCards[0].type;
        
        let hasOtherThanTrumpf = false;        
        validationParameter.handCards.forEach(card => {
            if (card.type !== trumpfColor){
                hasOtherThanTrumpf = true;
            }            
        });
        
        if (!hasOtherThanTrumpf){
            return {
                permitted: true
            };
        }
        
        
        validationParameter.tableCards.forEach(card => {
            if (card.type === trumpfColor){
                highestTrumpfOnTableIndex = Math.max(highestTrumpfOnTableIndex, trumpfQuantifier.indexOf(card.number)); 
            }            
        });
        
        if (cardTrumpfIndex < highestTrumpfOnTableIndex) {
            return {
                permitted: false,
                message: 'UnderTrumpfValidator: Undetrumpf is not allowed!'
            }; 
        }
        else {
            return {
                    permitted: true
                }; 
        }
    }
};

module.exports = UnderTrumpfValidator;