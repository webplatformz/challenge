

import {GameMode} from '../../../shared/game/gameMode';
import {CardColor} from '../../../shared/deck/cardColor';


const nonTrumpCardValues = {
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 10,
    11: 2,
    12: 3,
    13: 4,
    14: 11
};

const trumpCardValues = {
    6: 0,
    7: 0,
    8: 0,
    9: 14,
    10: 10,
    11: 20,
    12: 3,
    13: 4,
    14: 11
};

const obeabeCardValues = {
    6: 0,
    7: 0,
    8: 8,
    9: 0,
    10: 10,
    11: 2,
    12: 3,
    13: 4,
    14: 11
};

const undeufeCardValues = {
    6: 11,
    7: 0,
    8: 8,
    9: 0,
    10: 10,
    11: 2,
    12: 3,
    13: 4,
    14: 0
};


const calculateMultiplicator = function calculateMultiplicator(mode, gameTrumpf) {
    if (Boolean(process.env.TOURNAMENT_COUNTING) === true) {
        return 1;
    } else if (mode === GameMode.OBEABE || mode === GameMode.UNDEUFE) {
        return 3;
    } else if (gameTrumpf === CardColor.CLUBS || gameTrumpf === CardColor.SPADES) {
        return 2;
    } else {
        return 1;
    }
};

export function count(mode, cardColor, cardSet) {
    let result = 0;

    cardSet.forEach(card => {
        if (mode === GameMode.OBEABE) {
            result += obeabeCardValues[card.number];
        } else if (mode === GameMode.UNDEUFE) {
            result += undeufeCardValues[card.number];
        } else if (cardColor === card.color) {
            result += trumpCardValues[card.number];
        } else {
            result += nonTrumpCardValues[card.number];
        }
    });

    result = calculateMultiplicator(mode, cardColor) * result;
    return result;
}

export function calculateMatchValues(mode, cardColor) {
    return 100 * calculateMultiplicator(mode, cardColor);
}

export function calculateLastStichValue(mode, cardColor) {
    return 5 * calculateMultiplicator(mode, cardColor);
}