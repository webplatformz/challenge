'use strict';

import {GameMode} from '../../../shared/game/gameMode.js';

let StichGranter = {
    determineWinner: function (mode, trumpfColor, playedCards, players) {
        let winnerIndex = 0;
        let winnerCard;

        function trumpfAlreadyPlayed() {
            return winnerCard.color === trumpfColor;
        }

        function isTrumpf(card) {
            return card.color === trumpfColor;
        }

        function noTrumpfPlayedYet() {
            return !trumpfAlreadyPlayed();
        }

        function isHighestCardSoFar(card) {
            return card.color === winnerCard.color && card.number > winnerCard.number;
        }

        function isLowestCardSoFar(card) {
            return card.color === winnerCard.color && card.number < winnerCard.number;
        }

        function isFirstCard(index) {
            return index === 0;
        }

        function isBuur(card) {
            return card.number === 11 && card.color === trumpfColor;
        }

        function isNell(card) {
            return card.number === 9 && card.color === trumpfColor;
        }

        function buurAlreadyPlayed() {
            return isBuur(winnerCard);
        }

        function nellAlreadyPlayed() {
            return isNell(winnerCard);
        }

        function neitherBuurNorNellPlayed() {
            return !(buurAlreadyPlayed() || nellAlreadyPlayed());
        }

        function isHighestTrumpfSoFar(card) {
            if (!isTrumpf(card)) {
                return false;
            }
            if (isBuur(card)) {
                return true;
            }
            if(!isBuur(winnerCard) && isNell(card)) {
                return true;
            }

            if (neitherBuurNorNellPlayed() && trumpfAlreadyPlayed()) {
                return card.number > winnerCard.number;
            } else {
                return !trumpfAlreadyPlayed();
            }
        }

        function setCardToCurrentWinner(index, card) {
            winnerIndex = index;
            winnerCard = card;
        }

        playedCards.forEach((card, index) => {
            if (isFirstCard(index)) {
                setCardToCurrentWinner(index, card);
            } else if (mode === GameMode.TRUMPF) {
                if (isHighestTrumpfSoFar(card)) {
                    setCardToCurrentWinner(index, card);
                } else if (noTrumpfPlayedYet() && isHighestCardSoFar(card)) {
                    setCardToCurrentWinner(index, card);
                }
            } else if (mode === GameMode.UNDEUFE) {
                if (isLowestCardSoFar(card)) {
                    setCardToCurrentWinner(index, card);
                }
            } else if(mode === GameMode.OBEABE) {
                if(isHighestCardSoFar(card)) {
                    setCardToCurrentWinner(index, card);
                }
            }
        });
        return players[winnerIndex];
    }

};

export default StichGranter;