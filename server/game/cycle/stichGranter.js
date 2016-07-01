import {GameMode} from '../../../shared/game/gameMode';

const StichGranter = {
    determineWinner: function (mode, trumpfColor, playedCards, players) {
        const firstPlayedColor = playedCards[0].color;
        const isModeTrumpf = mode === GameMode.TRUMPF;
        const trumpfAndFirstPlayedColorCards = playedCards.map(addIndexAndAdjustTrumpfValues)
                .filter((playedCard) => playedCard.color === firstPlayedColor
                || (isModeTrumpf && isTrumpf(playedCard)));

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

        function addIndexAndAdjustTrumpfValues(card, index) {
            let valueForSorting = card.number;
            if (isModeTrumpf && isTrumpf(card)) {
                valueForSorting += 20;
                valueForSorting += isBuur(card) || isNell(card) ? 60 : 0;
            }
            return {
                index,
                color: card.color,
                number: card.number,
                valueForSorting
            };

        }

        function isTrumpf(card) {
            return card.color === trumpfColor;
        }

        function isBuur(card) {
            return card.number === 11 && isTrumpf(card);
        }

        function isNell(card) {
            return card.number === 9 && isTrumpf(card);
        }
    }
};
export default StichGranter;
