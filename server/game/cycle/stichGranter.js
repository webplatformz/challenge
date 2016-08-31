import {GameMode} from '../../../shared/game/gameMode';

function addIndexAndAdjustTrumpfValues(card, index, isModeTrumpf, trumpfColor) {
    let valueForSorting = card.number;
    if (isModeTrumpf && isTrumpf(card, trumpfColor)) {
        valueForSorting += 20;
        valueForSorting += isBuur(card, trumpfColor) || isNell(card, trumpfColor) ? 60 : 0;
    }
    return {
        index,
        color: card.color,
        number: card.number,
        valueForSorting
    };
}

function isTrumpf(card, trumpfColor) {
    return card.color === trumpfColor;
}

function isBuur(card, trumpfColor) {
    return card.number === 11 && isTrumpf(card, trumpfColor);
}

function isNell(card, trumpfColor) {
    return card.number === 9 && isTrumpf(card, trumpfColor);
}

const StichGranter = {
    determineWinner(mode, trumpfColor, playedCards, players) {
        const firstPlayedColor = playedCards[0].color;
        const isModeTrumpf = mode === GameMode.TRUMPF;
        const trumpfAndFirstPlayedColorCards = playedCards
                .map((card, index) => addIndexAndAdjustTrumpfValues(card, index, isModeTrumpf, trumpfColor))
                .filter((playedCard) => playedCard.color === firstPlayedColor
                || (isModeTrumpf && isTrumpf(playedCard, trumpfColor)));

        switch (mode) {
            case GameMode.UNDEUFE:
                trumpfAndFirstPlayedColorCards.sort((card1, card2) => {
                    return card1.valueForSorting - card2.valueForSorting
                });
                break;
            case GameMode.OBEABE:
            case GameMode.TRUMPF:
                trumpfAndFirstPlayedColorCards.sort((card1, card2) => {
                    return card2.valueForSorting - card1.valueForSorting
                });
                break;
        }

        return players[trumpfAndFirstPlayedColorCards[0].index];
    }
};

export default StichGranter;
