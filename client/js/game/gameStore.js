'use strict';

import {EventEmitter} from 'events';
import JassAppDispatcher from '../jassAppDispatcher';
import JassAppConstants from '../jassAppConstants';

const GameState = {
    WAITING: 'WAITING',
    SESSION_STARTED: 'SESSION_STARTED',
    REQUESTING_TRUMPF: 'REQUESTING_TRUMPF',
    TRUMPF_CHOSEN: 'TRUMPF_CHOSEN',
    REQUESTING_CARD: 'REQUESTING_CARD',
    REJECTED_CARD: 'REJECTED_CARD',
    REQUESTING_CARDS_FROM_OTHER_PLAYERS: 'REQUESTING_CARDS_FROM_OTHER_PLAYERS',
    STICH: 'STICH'
};

const CardType = {
    FRENCH: 'french',
    GERMAN: 'german'
};

const PlayerType = {
    PLAYER: 'PLAYER',
    SPECTATOR: 'SPECTATOR'
};

let player,
    nextStartingPlayerIndex = 0,
    spectatorEventQueue = [],
    spectatorRenderingIntervall = 500;

let GameStore = Object.assign(Object.create(EventEmitter.prototype), {
    GameState,
    CardType,
    PlayerType,

    state: {
        playerType: PlayerType.PLAYER,
        cardType: CardType.FRENCH,
        players: [],
        teams : [],
        playerSeating: ['bottom', 'left', 'top', 'right'],
        tableCards: [],
        playerCards: [],
        startingPlayerIndex: 0,
        status: GameState.WAITING
    },

    emitChange: function(source) {
        if(source === 'SERVER_ACTION' && this.state.playerType === PlayerType.SPECTATOR) {
            spectatorEventQueue.push('change');
        } else {
            this.emit('change');
        }
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    spectatorRendering: function() {
        var event = spectatorEventQueue.pop();
        if (event) {
            this.emit(event);
        }
        setTimeout(this.spectatorRendering.bind(GameStore), spectatorRenderingIntervall);
    },

    handleAction: function(payload) {
        let action = payload.action;

        switch(action.actionType) {
            case JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR:
                this.state.playerType = PlayerType.SPECTATOR;
                this.spectatorRendering();
                this.emitChange(payload.source);
                break;
            case JassAppConstants.ADJUST_SPECTATOR_SPEED:
                spectatorRenderingIntervall = action.data;
                break;
            case JassAppConstants.SESSION_JOINED:
                let playerSeating = this.state.playerSeating,
                    playerIndex;

                if (!player) {
                    player = action.data.player;
                    this.state.players = action.data.playersInSession;

                    playerIndex = this.state.players.findIndex((element) => {
                        return element.id === player.id;
                    });
                } else {
                    this.state.players.push(action.data.player);
                }

                this.state.playerSeating = playerSeating.concat(playerSeating.splice(0, 4 - playerIndex));
                this.emitChange(payload.source);
                break;
            case JassAppConstants.BROADCAST_TEAMS:
                this.state.status = GameState.SESSION_STARTED;
                this.state.teams = action.data;
                this.emitChange(payload.source);
                break;
            case JassAppConstants.DEAL_CARDS:
                this.state.playerCards = action.data;
                this.emitChange(payload.source);
                break;
            case JassAppConstants.REQUEST_TRUMPF:
                this.state.status = GameState.REQUESTING_TRUMPF;
                this.state.isGeschoben = action.data;
                this.emitChange(payload.source);
                break;
            case JassAppConstants.CHOOSE_TRUMPF:
                this.state.status = GameState.TRUMPF_CHOSEN;
                this.emitChange(payload.source);
                break;
            case JassAppConstants.BROADCAST_TRUMPF:
                this.state.status = GameState.TRUMPF_CHOSEN;
                this.state.mode = action.data.mode;
                this.state.color = action.data.trumpfColor;
                this.emitChange(payload.source);
                break;
            case JassAppConstants.CHANGE_CARD_TYPE:
                this.state.cardType = action.data;
                this.emitChange(payload.source);
                break;
            case JassAppConstants.REQUEST_CARD:
                this.state.status = GameState.REQUESTING_CARD;
                this.emitChange(payload.source);
                break;
            case JassAppConstants.CHOOSE_CARD:
                let chosenCard = action.data;
                this.state.playerCards = this.state.playerCards.filter((card) => {
                    return chosenCard.color !== card.color || chosenCard.number !== card.number;
                });
                this.emitChange(payload.source);
                break;
            case JassAppConstants.REJECT_CARD:
                let rejectedCard = action.data;
                this.state.status = GameState.REJECTED_CARD;
                this.state.playerCards.push(rejectedCard);
                this.emitChange(payload.source);
                break;
            case JassAppConstants.PLAYED_CARDS:
                this.state.startingPlayerIndex = nextStartingPlayerIndex;
                this.state.status = GameState.REQUESTING_CARDS_FROM_OTHER_PLAYERS;
                this.state.tableCards = action.data;
                this.emitChange(payload.source);
                break;
            case JassAppConstants.BROADCAST_STICH:
                let playerId = action.data.id,
                    teams = action.data.teams;
                this.state.status = GameState.STICH;
                this.state.players.every((player, index) => {
                    if (player.id === playerId) {
                        nextStartingPlayerIndex = index;
                        return false;
                    }

                    return true;
                });
                teams.forEach((team) => {
                    this.state.teams.forEach((stateTeam) => {
                        if (stateTeam.name === team.name) {
                            stateTeam.currentRoundPoints = team.currentRoundPoints;
                        }
                    });
                });
                break;
        }
    }
});

JassAppDispatcher.register(GameStore.handleAction.bind(GameStore));

module.exports = GameStore;