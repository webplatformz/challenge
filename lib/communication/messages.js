'use strict';

let MessageType = {
    DEAL_CARDS: 'DEAL_CARDS',
    REQUEST_TRUMPF: 'REQUEST_TRUMPF',
    CHOOSE_TRUMPF: 'CHOOSE_TRUMPF',
    BROADCAST_TRUMPF: 'BROADCAST_TRUMPF',
    PLAYED_CARDS: 'PLAYED_CARDS'
};

function createDealCards (cards) {
    return {
        type: MessageType.DEAL_CARDS,
        data: {
            cards
        }
    };
}

function createRequestTrumpf (geschoben) {
    return {
        type: MessageType.REQUEST_TRUMPF,
        data: {
            geschoben
        }
    };
}

function createChooseTrumpf (gameType) {
    return {
        type: MessageType.CHOOSE_TRUMPF,
        data: {
            gameType
        }
    };
}

function createBroadcastTrumpf (gameType) {
    return {
        type: MessageType.BROADCAST_TRUMPF,
        data: {
            gameType
        }
    };
}

function createPlayedCards (playedCards) {
    return {
        type: MessageType.PLAYED_CARDS,
        data: {
            playedCards
        }
    };
}

function create(messageType, ...data) {
    switch (messageType) {
        case MessageType.DEAL_CARDS:
            return createDealCards(...data);
        case MessageType.REQUEST_TRUMPF:
            return createRequestTrumpf(...data);
        case MessageType.CHOOSE_TRUMPF:
            return createChooseTrumpf(...data);
        case MessageType.BROADCAST_TRUMPF:
            return createBroadcastTrumpf(...data);
        case MessageType.PLAYED_CARDS:
            return createPlayedCards(...data);
        default:
            throw 'Unknown message type ' + messageType;
    }
}

module.exports = {
    MessageType,
    create
};