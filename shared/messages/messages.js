'use strict';

let Card = require('../deck/card');

let MessageType = {
    REQUEST_PLAYER_NAME: 'REQUEST_PLAYER_NAME',
    CHOOSE_PLAYER_NAME: 'CHOOSE_PLAYER_NAME',
    DEAL_CARDS: 'DEAL_CARDS',
    REQUEST_TRUMPF: 'REQUEST_TRUMPF',
    CHOOSE_TRUMPF: 'CHOOSE_TRUMPF',
    BROADCAST_TRUMPF: 'BROADCAST_TRUMPF',
    BROADCAST_STICH: 'BROADCAST_STICH',
    BROADCAST_WINNER_TEAM: 'BROADCAST_WINNER_TEAM',
    PLAYED_CARDS: 'PLAYED_CARDS',
    REQUEST_CARD: 'REQUEST_CARD',
    CHOOSE_CARD: 'CHOOSE_CARD',
    REJECT_CARD: 'REJECT_CARD'
};

function createRequestPlayerName () {
    return {
        type: MessageType.REQUEST_PLAYER_NAME
    };
}

function createChoosePlayerName (playerName) {
    return {
        type: MessageType.CHOOSE_PLAYER_NAME,
        data: playerName
    };
}

function createDealCards (cards) {
    return {
        type: MessageType.DEAL_CARDS,
        data: cards
    };
}

function createRequestTrumpf (geschoben) {
    return {
        type: MessageType.REQUEST_TRUMPF,
        data: geschoben
    };
}

function createChooseTrumpf (gameType) {
    return {
        type: MessageType.CHOOSE_TRUMPF,
        data: gameType
    };
}

function createBroadcastTrumpf (gameType) {
    return {
        type: MessageType.BROADCAST_TRUMPF,
        data: gameType
    };
}

function createBroadcastStich (winner) {
    return {
        type: MessageType.BROADCAST_STICH,
        data: winner
    };
}

function createBroadcastWinnerTeam(team) {
    return {
        type: MessageType.BROADCAST_WINNER_TEAM,
        data: team
    };
}

function createPlayedCards (playedCards) {
    return {
        type: MessageType.PLAYED_CARDS,
        data: playedCards
    };
}

function createRequestCard (cards) {
    return {
        type: MessageType.REQUEST_CARD,
        data: cards
    };
}

function createChooseCard (card) {
    return {
        type: MessageType.CHOOSE_CARD,
        data: Card.create(card.number, card.color)
    };
}

function createRejectCard (card) {
    return {
        type: MessageType.REJECT_CARD,
        data: card
    };
}

function create(messageType, ...data) {
    switch (messageType) {
        case MessageType.REQUEST_PLAYER_NAME:
            return createRequestPlayerName();
        case MessageType.CHOOSE_PLAYER_NAME:
            return createChoosePlayerName(...data);
        case MessageType.DEAL_CARDS:
            return createDealCards(...data);
        case MessageType.REQUEST_TRUMPF:
            return createRequestTrumpf(...data);
        case MessageType.CHOOSE_TRUMPF:
            return createChooseTrumpf(...data);
        case MessageType.BROADCAST_TRUMPF:
            return createBroadcastTrumpf(...data);
        case MessageType.BROADCAST_WINNER_TEAM:
            return createBroadcastWinnerTeam(...data);
        case MessageType.BROADCAST_STICH:
            return createBroadcastStich(...data);
        case MessageType.PLAYED_CARDS:
            return createPlayedCards(...data);
        case MessageType.REQUEST_CARD:
            return createRequestCard(...data);
        case MessageType.CHOOSE_CARD:
            return createChooseCard(...data);
        case MessageType.REJECT_CARD:
            return createRejectCard(...data);
        default:
            throw 'Unknown message type ' + messageType;
    }
}

module.exports = {
    MessageType,
    create
};