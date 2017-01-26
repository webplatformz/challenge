import Validation from '../../../shared/game/validation/validation';
import stichGranter from './stichGranter';
import * as Counter from '../counter/counter';

const Cycle = {
    iterate() {
        const handleChosenCard = (player, card) => {
            this.currentPlayer = player;

            if (this.validator.validate(this.playedCards, this.currentPlayer.cards, card)) {
                this.playedCards.push(card);
                this.currentPlayer.removeCard(card);
                this.clientApi.broadcastCardPlayed(this.playedCards);
            } else {
                this.currentPlayer.rejectCard(card, this.playedCards);

                return this.currentPlayer.requestCard(this.playedCards)
                    .then(handleChosenCard.bind(null, player));
            }

            return this.playedCards;
        };

        const getOtherTeam = team => this.players.find(player => player.team !== team).team;

        const broadcastAndReturnWinner = (playedCards) => {
            let winner = stichGranter.determineWinner(this.gameType.mode, this.gameType.trumpfColor, playedCards, this.players);
            let winnerTeam = winner.team;
            let loserTeam = getOtherTeam(winnerTeam);
            let actPoints = Counter.count(this.gameType.mode, this.gameType.trumpfColor, playedCards);

            winnerTeam.points += actPoints;
            winnerTeam.currentRoundPoints += actPoints;

            if (winner.cards.length === 0) {
                const lastStichPoints = Counter.calculateLastStichValue(this.gameType.mode, this.gameType.trumpfColor);
                winnerTeam.points += lastStichPoints;
                winnerTeam.currentRoundPoints += lastStichPoints;

                if (loserTeam.currentRoundPoints === 0) {
                    let matchPoints = Counter.calculateMatchValues(this.gameType.mode, this.gameType.trumpfColor);
                    winnerTeam.points += matchPoints;
                    winnerTeam.currentRoundPoints += matchPoints;
                }

                this.clientApi.broadcastStich(createStichMessage(winner));
                this.clientApi.broadcastGameFinished([winnerTeam, loserTeam]);
                winnerTeam.currentRoundPoints = 0;
                loserTeam.currentRoundPoints = 0;
            } else {
                this.clientApi.broadcastStich(createStichMessage(winner));
            }

            return winner;
        };

        const createStichMessage = winner => ({
            name: winner.name,
            id: winner.id,
            seatId: winner.seatId,
            playedCards: this.playedCards,
            teams: [
                winner.team,
                getOtherTeam(winner.team)
            ]
        });


        return this.players.reduce((previousPlayer, currentPlayer, index) => {
            let previousPromise;

            if (index === 1) {
                previousPromise = previousPlayer.requestCard(this.playedCards).then(handleChosenCard.bind(null, previousPlayer));
            } else {
                previousPromise = previousPlayer;
            }

            return previousPromise.then((cardsOnTable) => {
                return currentPlayer.requestCard(cardsOnTable).then(handleChosenCard.bind(null, currentPlayer));
            });
        }).then(broadcastAndReturnWinner);
    }
};

function rotatePlayersToCurrentPlayer(players, currentPlayer) {
    for (; players[0] !== currentPlayer;) {
        players.push(players.shift());
    }
}

export function create(currentPlayer, players, clientApi, gameType) {
    let cycle = Object.create(Cycle);
    cycle.currentPlayer = currentPlayer;

    rotatePlayersToCurrentPlayer(players, currentPlayer);
    cycle.players = players;
    cycle.gameType = gameType;
    cycle.clientApi = clientApi;
    cycle.validator = Validation.create(gameType.mode, gameType.trumpfColor);
    cycle.playedCards = [];
    return cycle;
}
