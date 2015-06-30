'use strict';

let MessageType = {
    REQUEST_TRUMPF: 'REQUEST_TRUMPF',
    CHOOSE_TRUMPF: 'CHOOSE_TRUMPF',
    BROADCAST_TRUMPF: 'BROADCAST_TRUMPF',
    PLAYED_CARDS: 'PLAYED_CARDS'
};

function createRequestTrumpf (pushed) {
    return {
        type: MessageType.REQUEST_TRUMPF,
        data: {
            pushed
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