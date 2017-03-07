import * as Card from '../deck/card';
import {MessageType} from './messageType';

function createRequestPlayerName() {
    return {
        type: MessageType.REQUEST_PLAYER_NAME.name
    };
}

function createChoosePlayerName(playerName) {
    return {
        type: MessageType.CHOOSE_PLAYER_NAME.name,
        data: playerName
    };
}

function createBroadcastTeams(teams) {
    return {
        type: MessageType.BROADCAST_TEAMS.name,
        data: teams
    };
}

function createDealCards(cards) {
    return {
        type: MessageType.DEAL_CARDS.name,
        data: cards
    };
}

function createRequestTrumpf(geschoben) {
    return {
        type: MessageType.REQUEST_TRUMPF.name,
        data: geschoben
    };
}

function createRejectTrumpf(gameType) {
    return {
        type: MessageType.REJECT_TRUMPF.name,
        data: gameType
    };
}

function createChooseTrumpf(gameType) {
    return {
        type: MessageType.CHOOSE_TRUMPF.name,
        data: gameType
    };
}

function createBroadcastTrumpf(gameType) {
    return {
        type: MessageType.BROADCAST_TRUMPF.name,
        data: gameType
    };
}

function createBroadcastStich(winner) {
    return {
        type: MessageType.BROADCAST_STICH.name,
        data: winner
    };
}

function createBroadcastGameFinished(teams) {
    return {
        type: MessageType.BROADCAST_GAME_FINISHED.name,
        data: teams
    };
}


function createBroadcastWinnerTeam(team) {
    return {
        type: MessageType.BROADCAST_WINNER_TEAM.name,
        data: team
    };
}

function createPlayedCards(playedCards) {
    return {
        type: MessageType.PLAYED_CARDS.name,
        data: playedCards
    };
}

function createRequestCard(cards) {
    return {
        type: MessageType.REQUEST_CARD.name,
        data: cards
    };
}

function createChooseCard(card) {
    return {
        type: MessageType.CHOOSE_CARD.name,
        data: Card.create(card.number, card.color)
    };
}

function createRejectCard(card) {
    return {
        type: MessageType.REJECT_CARD.name,
        data: card
    };
}

function createRequestSessionChoice(availableSessions) {
    return {
        type: MessageType.REQUEST_SESSION_CHOICE.name,
        data: availableSessions
    };
}

function createChooseSession(sessionChoice, {sessionName, sessionType, asSpectator, chosenTeamIndex} = {}) {
    return {
        type: MessageType.CHOOSE_SESSION.name,
        data: {
            sessionChoice,
            sessionName,
            sessionType,
            asSpectator,
            chosenTeamIndex
        }
    };
}

function createSessionJoined(sessionName, player, playersInSession) {
    return {
        type: MessageType.SESSION_JOINED.name,
        data: {
            sessionName,
            player,
            playersInSession
        }
    };
}

function createBroadcastSessionJoined(sessionName, player, playersInSession) {
    return {
        type: MessageType.BROADCAST_SESSION_JOINED.name,
        data: {
            sessionName,
            player,
            playersInSession
        }
    };
}

function createBadMessage(message) {
    return {
        type: MessageType.BAD_MESSAGE.name,
        data: message
    };
}

function createTournamentRankingTable(rankingTable) {
    return {
        type: MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name,
        data: rankingTable
    };
}

function createStartTournament() {
    return {
        type: MessageType.START_TOURNAMENT.name
    };
}

function createBroadcastTournamentStarted() {
    return {
        type: MessageType.BROADCAST_TOURNAMENT_STARTED.name
    };
}

function createJoinBot(data) {
    return {
        type: MessageType.JOIN_BOT.name,
        data
    }
}

function createRequestRegistryBots(data) {
    return {
        type: MessageType.REQUEST_REGISTRY_BOTS.name,
        data
    }
}
function createSendRegistryBots(data) {
    return {
        type: MessageType.SEND_REGISTRY_BOTS.name,
        data
    }
}
function createAddBotFromRegistry(data) {
    return {
        type: MessageType.ADD_BOT_FROM_REGISTRY.name,
        data
    }
}

function createError(data) {
    return {
        type: MessageType.ERROR.name,
        data
    }
}

export function create(messageType, ...data) {
    switch (messageType) {
        case MessageType.REQUEST_PLAYER_NAME.name:
            return createRequestPlayerName();
        case MessageType.CHOOSE_PLAYER_NAME.name:
            return createChoosePlayerName(...data);
        case MessageType.BROADCAST_TEAMS.name:
            return createBroadcastTeams(...data);
        case MessageType.DEAL_CARDS.name:
            return createDealCards(...data);
        case MessageType.REQUEST_TRUMPF.name:
            return createRequestTrumpf(...data);
        case MessageType.REJECT_TRUMPF.name:
            return createRejectTrumpf(...data);
        case MessageType.CHOOSE_TRUMPF.name:
            return createChooseTrumpf(...data);
        case MessageType.BROADCAST_TRUMPF.name:
            return createBroadcastTrumpf(...data);
        case MessageType.BROADCAST_WINNER_TEAM.name:
            return createBroadcastWinnerTeam(...data);
        case MessageType.BROADCAST_STICH.name:
            return createBroadcastStich(...data);
        case MessageType.BROADCAST_GAME_FINISHED.name:
            return createBroadcastGameFinished(...data);
        case MessageType.PLAYED_CARDS.name:
            return createPlayedCards(...data);
        case MessageType.REQUEST_CARD.name:
            return createRequestCard(...data);
        case MessageType.CHOOSE_CARD.name:
            return createChooseCard(...data);
        case MessageType.REJECT_CARD.name:
            return createRejectCard(...data);
        case MessageType.REQUEST_SESSION_CHOICE.name:
            return createRequestSessionChoice(...data);
        case MessageType.CHOOSE_SESSION.name:
            return createChooseSession(...data);
        case MessageType.SESSION_JOINED.name:
            return createSessionJoined(...data);
        case MessageType.BROADCAST_SESSION_JOINED.name:
            return createBroadcastSessionJoined(...data);
        case MessageType.BAD_MESSAGE.name:
            return createBadMessage(...data);
        case MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name:
            return createTournamentRankingTable(...data);
        case MessageType.START_TOURNAMENT.name:
            return createStartTournament(...data);
        case MessageType.BROADCAST_TOURNAMENT_STARTED.name:
            return createBroadcastTournamentStarted(...data);
        case MessageType.JOIN_BOT.name:
            return createJoinBot(...data);
        case MessageType.REQUEST_REGISTRY_BOTS.name:
            return createRequestRegistryBots(...data);
        case MessageType.SEND_REGISTRY_BOTS.name:
            return createSendRegistryBots(...data);
        case MessageType.ADD_BOT_FROM_REGISTRY.name:
            return createAddBotFromRegistry(...data);
        case MessageType.ERROR.name:
            return createError(...data);
        default:
            throw 'Unknown message type ' + messageType;
    }
}
