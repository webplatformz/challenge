'use strict';

let GameMode = require('../gameMode');
let Card = require('../../../shared/deck/card');

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

        function isHighestTrumpfSoFar(card) {
            if (!isTrumpf(card)) {
                return false;
            }
            if (card.isBuur()) {
                return true;
            }
            if(!winnerCard.isBuur() && card.isNell()) {
                return true;
            }
            if (trumpfAlreadyPlayed()) {
                return card.number > winnerCard.number;
            } else {
                return true;
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
            } else if (mode === GameMode.UNTENRAUF) {
                if (isLowestCardSoFar(card)) {
                    setCardToCurrentWinner(index, card);
                }
            } else if(mode === GameMode.OBENABEN) {
                if(isHighestCardSoFar(card)) {
                    setCardToCurrentWinner(index, card);
                }
            }
        });
        return players[winnerIndex];
    }

};

module.exports = StichGranter;