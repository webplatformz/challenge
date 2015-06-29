'use strict';

let MessageType = {
    REQUEST_TRUMPF: 'REQUEST_TRUMPF',
    CHOOSE_TRUMPF: 'CHOOSE_TRUMPF',
    CARDS_PLAYED: 'CARDS_PLAYED'
};

function createRequestTrump (pushed) {
    return {
        type: MessageType.REQUEST_TRUMPF,
        data: {
            pushed
        }
    };
}

function createChooseTrump (color) {
    return {
        type: MessageType.CHOOSE_TRUMPF,
        data: {
            color
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
    let parameters = Array.prototype.slice.apply(arguments);

    switch (parameters.shift()) {
        case MessageType.REQUEST_TRUMPF:
            return createRequestTrump.apply(undefined, parameters);
        case MessageType.CHOOSE_TRUMPF:
            return createChooseTrump.apply(undefined, parameters);
        case MessageType.CARDS_PLAYED:
            return createCardsPlayed.apply(undefined, parameters);
    }
}

module.exports = {
    MessageType,
    create
};