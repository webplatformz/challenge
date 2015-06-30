'use strict';

let MessageType = {
    REQUEST_TRUMPF: 'REQUEST_TRUMPF',
    CHOOSE_TRUMPF: 'CHOOSE_TRUMPF',
    BROADCAST_TRUMPF: 'BROADCAST_TRUMPF',
    CARDS_PLAYED: 'CARDS_PLAYED'
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

function createCardsPlayed (cardsPlayed) {
    return {
        type: MessageType.CARDS_PLAYED,
        data: {
            cardsPlayed
        }
    };
}

function create() {
    let parameters = Array.prototype.slice.apply(arguments),
        messageType = parameters.shift();

    switch (messageType) {
        case MessageType.REQUEST_TRUMPF:
            return createRequestTrumpf.apply(undefined, parameters);
        case MessageType.CHOOSE_TRUMPF:
            return createChooseTrumpf.apply(undefined, parameters);
        case MessageType.BROADCAST_TRUMPF:
            return createBroadcastTrumpf.apply(undefined, parameters);
        case MessageType.CARDS_PLAYED:
            return createCardsPlayed.apply(undefined, parameters);
        default:
            throw 'Unknown message type ' + messageType;
    }
}

module.exports = {
    MessageType,
    create
};