'use strict';

let Card = require('../deck/card');

let MessageType = {
    REQUEST_PLAYER_NAME: 'REQUEST_PLAYER_NAME',
    CHOOSE_PLAYER_NAME: 'CHOOSE_PLAYER_NAME',
    BROADCAST_TEAMS: 'BROADCAST_TEAMS',
    DEAL_CARDS: 'DEAL_CARDS',
    REQUEST_TRUMPF: 'REQUEST_TRUMPF',
    CHOOSE_TRUMPF: 'CHOOSE_TRUMPF',
    REJECT_TRUMPF: 'REJECT_TRUMPF',
    BROADCAST_TRUMPF: 'BROADCAST_TRUMPF',
    BROADCAST_STICH: 'BROADCAST_STICH',
    BROADCAST_WINNER_TEAM: 'BROADCAST_WINNER_TEAM',
    BROADCAST_GAME_FINISHED: 'BROADCAST_GAME_FINISHED',
    PLAYED_CARDS: 'PLAYED_CARDS',
    REQUEST_CARD: 'REQUEST_CARD',
    CHOOSE_CARD: 'CHOOSE_CARD',
    REJECT_CARD: 'REJECT_CARD',
    REQUEST_SESSION_CHOICE: 'REQUEST_SESSION_CHOICE',
    CHOOSE_SESSION: 'CHOOSE_SESSION',
    BROADCAST_SESSION_JOINED: 'BROADCAST_SESSION_JOINED'
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

function createBroadcastTeams (teams) {
    return {
        type: MessageType.BROADCAST_TEAMS,
        data: teams
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

function createRejectTrumpf (gameType) {
    return {
        type: MessageType.REJECT_TRUMPF,
        data: gameType
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

function createBroadcastGameFinished (teams) {
    return {
        type: MessageType.BROADCAST_GAME_FINISHED,
        data: teams
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

function createRequestSessionChoice (availableSessions) {
    return {
        type: MessageType.REQUEST_SESSION_CHOICE,
        data: availableSessions
    };
}

function createChooseSession(sessionChoice, sessionName) {
    return {
        type: MessageType.CHOOSE_SESSION,
        data: {
            sessionChoice,
            sessionName
        }
    };
}

function createBroadcastSessionJoined(name, id) {
    return {
        type: MessageType.BROADCAST_SESSION_JOINED,
        data: {
            name,
            id
        }
    };
}

function create(messageType, ...data) {
    switch (messageType) {
        case MessageType.REQUEST_PLAYER_NAME:
            return createRequestPlayerName();
        case MessageType.CHOOSE_PLAYER_NAME:
            return createChoosePlayerName(...data);
        case MessageType.BROADCAST_TEAMS:
            return createBroadcastTeams(...data);
        case MessageType.DEAL_CARDS:
            return createDealCards(...data);
        case MessageType.REQUEST_TRUMPF:
            return createRequestTrumpf(...data);
        case MessageType.REJECT_TRUMPF:
            return createRejectTrumpf(...data);
        case MessageType.CHOOSE_TRUMPF:
            return createChooseTrumpf(...data);
        case MessageType.BROADCAST_TRUMPF:
            return createBroadcastTrumpf(...data);
        case MessageType.BROADCAST_WINNER_TEAM:
            return createBroadcastWinnerTeam(...data);
        case MessageType.BROADCAST_STICH:
            return createBroadcastStich(...data);
        case MessageType.BROADCAST_GAME_FINISHED:
            return createBroadcastGameFinished(...data);
        case MessageType.PLAYED_CARDS:
            return createPlayedCards(...data);
        case MessageType.REQUEST_CARD:
            return createRequestCard(...data);
        case MessageType.CHOOSE_CARD:
            return createChooseCard(...data);
        case MessageType.REJECT_CARD:
            return createRejectCard(...data);
        case MessageType.REQUEST_SESSION_CHOICE:
            return createRequestSessionChoice(...data);
        case MessageType.CHOOSE_SESSION:
            return createChooseSession(...data);
        case MessageType.BROADCAST_SESSION_JOINED:
            return createBroadcastSessionJoined(...data);
        default:
            throw 'Unknown message type ' + messageType;
    }
}

module.exports = {
    MessageType,
    create
};