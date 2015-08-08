'use strict';

let EventEmitter = require('events').EventEmitter,
    JassAppDispatcher = require('../jassAppDispatcher'),
    JassAppConstants = require('../jassAppConstants');

let GameState = {
    WAITING: 'WAITING',
    SESSION_STARTED: 'SESSION_STARTED',
    REQUESTING_TRUMPF: 'REQUESTING_TRUMPF',
    TRUMPF_CHOSEN: 'TRUMPF_CHOSEN',
    REQUESTING_CARD: 'REQUESTING_CARD',
    REJECTED_CARD: 'REJECTED_CARD',
    REQUESTING_CARDS_FROM_OTHER_PLAYERS: 'REQUESTING_CARDS_FROM_OTHER_PLAYERS',
    STICH: 'STICH'
};

let CardType = {
    FRENCH: 'french',
    GERMAN: 'german'
};

let player;

let GameStore = Object.create(EventEmitter.prototype);

GameStore.GameState = GameState;
GameStore.CardType = CardType;

GameStore.state = {
    cardType: CardType.FRENCH,
    players: [],
    playerSeating: ['bottom', 'left', 'top', 'right'],
    tableCards: [],
    playerCards: [],
    startingPlayerIndex: 0,
    status: GameState.WAITING
};

GameStore.emitChange = function() {
    this.emit('change');
};

GameStore.addChangeListener = function(callback) {
    this.on('change', callback);
};

GameStore.removeChangeListener = function(callback) {
    this.removeListener('change', callback);
};

JassAppDispatcher.register(function (payload){
    let action = payload.action;

    switch(action.actionType) {
        case JassAppConstants.SESSION_JOINED:
            let playerSeating = GameStore.state.playerSeating,
                playerIndex;

            if (!player) {
                player = action.data.player;
                GameStore.state.players = action.data.playersInSession;

                playerIndex = GameStore.state.players.findIndex((element) => {
                    return element.id === player.id;
                });
            } else {
                GameStore.state.players.push(action.data.player);
            }

            GameStore.state.playerSeating = playerSeating.concat(playerSeating.splice(0, 4 - playerIndex));
            GameStore.emitChange();
            break;
        case JassAppConstants.BROADCAST_TEAMS:
            GameStore.state.status = GameState.SESSION_STARTED;
            //TODO handle teams and player for stats
            GameStore.emitChange();
            break;
        case JassAppConstants.DEAL_CARDS:
            GameStore.state.playerCards = action.data;
            GameStore.emitChange();
            break;
        case JassAppConstants.REQUEST_TRUMPF:
            GameStore.state.status = GameState.REQUESTING_TRUMPF;
            GameStore.state.isGeschoben = action.data;
            GameStore.emitChange();
            break;
        case JassAppConstants.CHOOSE_TRUMPF:
            GameStore.state.status = GameState.TRUMPF_CHOSEN;
            GameStore.emitChange();
            break;
        case JassAppConstants.BROADCAST_TRUMPF:
            GameStore.state.status = GameState.TRUMPF_CHOSEN;
            GameStore.state.mode = action.data.mode;
            GameStore.state.color = action.data.trumpfColor;
            GameStore.emitChange();
            break;
        case JassAppConstants.CHANGE_CARD_TYPE:
            GameStore.state.cardType = action.data;
            GameStore.emitChange();
            break;
        case JassAppConstants.REQUEST_CARD:
            GameStore.state.status = GameState.REQUESTING_CARD;
            GameStore.emitChange();
            break;
        case JassAppConstants.CHOOSE_CARD:
            let chosenCard = action.data;
            GameStore.state.playerCards = GameStore.state.playerCards.filter((card) => {
                return chosenCard.color !== card.color || chosenCard.number !== card.number;
            });
            GameStore.emitChange();
            break;
        case JassAppConstants.REJECT_CARD:
            let rejectedCard = action.data;
            GameStore.state.status = GameState.REJECTED_CARD;
            GameStore.state.playerCards.push(rejectedCard);
            GameStore.emitChange();
            break;
        case JassAppConstants.PLAYED_CARDS:
            GameStore.state.status = GameState.REQUESTING_CARDS_FROM_OTHER_PLAYERS;
            GameStore.state.tableCards = action.data;
            GameStore.emitChange();
            break;
        case JassAppConstants.BROADCAST_STICH:
            let playerId = action.data.id;
            GameStore.state.status = GameState.STICH;
            GameStore.state.players.every((player, index) => {
                if (player.id === playerId) {
                    GameStore.state.startingPlayerIndex = index;
                    return false;
                }

                return true;
            });
            GameStore.emitChange();
            break;
    }
});

module.exports = GameStore;