'use strict';

import Deck from './deck/deck.js';
import Cycle from './cycle/cycle.js';
import {GameMode} from './../../shared/game/gameMode.js';

function handleChooseTrumpf(game, gameType) {
    game.gameType = gameType;
    game.clientApi.broadcastTrumpf(gameType);
    return game.nextCycle();
}

function handleChooseTrumpfGeschoben(game, actPlayer, gameType) {
    if (gameType.mode !== GameMode.SCHIEBE) {
        return handleChooseTrumpf(game, gameType);
    }

    actPlayer.rejectTrumpf(gameType);
    return actPlayer.requestTrumpf(true).then((gameType) => {
        return handleChooseTrumpfGeschoben(game, actPlayer, gameType);
    });
}

let Game = {
    currentRound: 0,

    nextCycle: function (startPlayer) {
        if (this.currentRound < 9) {
            this.startPlayer = startPlayer || this.startPlayer;
            let cycle = Cycle.create(this.startPlayer, this.players, this.clientApi, this.gameType);
            this.currentRound++;
            return cycle.iterate().then((winner) => {
                return this.nextCycle(winner);
            });
        }
    },

    schieben: function () {
        for (let i = 0; i < this.players.length; i++) {
            let actPlayer = this.players[i];
            if (actPlayer !== this.startPlayer && actPlayer.team.name === this.startPlayer.team.name) {
                return actPlayer.requestTrumpf(true)
                    .then((gameType) => {
                        return handleChooseTrumpfGeschoben(this, actPlayer, gameType);
                    });
            }
        }
    },

    start: function () {
        return this.startPlayer.requestTrumpf(false)
            .then((gameType) => {
                if (gameType.mode === GameMode.SCHIEBE) {
                    this.clientApi.broadcastTrumpf(gameType);
                    return this.schieben();
                } else {
                    return handleChooseTrumpf(this, gameType);
                }
            });
    }
};

export function create(players, maxPoints, startPlayer, clientApi) {
    let game = Object.create(Game);
    game.deck = Deck.create();
    players.forEach(player => {
        game.deck.deal(player, 9);
    });

    game.players = players;
    game.maxPoints = maxPoints;
    game.startPlayer = startPlayer;
    game.clientApi = clientApi;
    return game;
}