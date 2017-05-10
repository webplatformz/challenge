import JassAppDispatcher from '../jassAppDispatcher';
import JassAppConstants from '../jassAppConstants';
import JassActions from '../jassActions';
import * as messages from '../../../shared/messages/messages';
import {MessageType} from '../../../shared/messages/messageType';
import {SessionChoice} from '../../../shared/session/sessionChoice';

const protocol = (process.env.NODE && ~process.env.NODE.indexOf('heroku')) ? 'wss' : 'ws';
const serverAddress = `${protocol}://${window.location.host}`;

let webSocket;

function sendJSONMessageToClient(messageType, ...data) {
    webSocket.send(JSON.stringify(messages.create(messageType, ...data)));
}

const ServerApi = {
    handleMessageFromServer: (messageEvent) => {
        let message = JSON.parse(messageEvent.data);

        switch (message.type) {
            case MessageType.BAD_MESSAGE.name:
            case MessageType.ERROR.name:
                JassActions.throwError('SERVER', message.data);
                break;
            case MessageType.REQUEST_PLAYER_NAME.name:
                JassActions.requestPlayerName();
                break;
            case MessageType.REQUEST_SESSION_CHOICE.name:
                JassActions.requestSessionChoice(message.data);
                break;
            case MessageType.SESSION_JOINED.name:
            case MessageType.BROADCAST_SESSION_JOINED.name:
                JassActions.sessionJoined(message.data);
                break;
            case MessageType.BROADCAST_TEAMS.name:
                JassActions.broadcastTeams(message.data);
                break;
            case MessageType.DEAL_CARDS.name:
                JassActions.dealCards(message.data);
                break;
            case MessageType.REQUEST_TRUMPF.name:
                JassActions.requestTrumpf(message.data);
                break;
            case MessageType.BROADCAST_TRUMPF.name:
                JassActions.broadastTrumpf(message.data);
                break;
            case MessageType.REQUEST_CARD.name:
                JassActions.requestCard(message.data);
                break;
            case MessageType.REJECT_CARD.name:
                JassActions.rejectCard(message.data);
                break;
            case MessageType.PLAYED_CARDS.name:
                JassActions.playedCards(message.data);
                break;
            case MessageType.BROADCAST_STICH.name:
                JassActions.broadcastStich(message.data);
                break;
            case MessageType.BROADCAST_GAME_FINISHED.name:
                JassActions.broadcastGameFinished();
                break;
            case MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name:
                JassActions.broadcastTournamentRankingTable(message.data);
                break;
            case MessageType.BROADCAST_TOURNAMENT_STARTED.name:
                JassActions.broadcastTournamentStarted();
                break;
            case MessageType.SEND_REGISTRY_BOTS.name:
                JassActions.sendRegistryBots(message.data);
                break;
            case MessageType.BROADCAST_WINNER_TEAM.name:
                JassActions.broadcastWinnerTeam(message.data);
                break;
        }
    },
    handleActionsFromUi: (payload) => {
        if (payload.source === 'VIEW_ACTION') {
            let action = payload.action;

            switch (action.actionType) {
                case JassAppConstants.REQUEST_REGISTRY_BOTS:
                    sendJSONMessageToClient(MessageType.REQUEST_REGISTRY_BOTS.name, action.data);
                    break;
                case JassAppConstants.ADD_BOT_FROM_REGISTRY:
                    sendJSONMessageToClient(MessageType.ADD_BOT_FROM_REGISTRY.name, action.data);
                    break;
                case JassAppConstants.CHOOSE_PLAYER_NAME:
                    sendJSONMessageToClient(MessageType.CHOOSE_PLAYER_NAME.name, action.data);
                    break;
                case JassAppConstants.CHOOSE_EXISTING_SESSION:
                    sendJSONMessageToClient(MessageType.CHOOSE_SESSION.name, SessionChoice.JOIN_EXISTING, action.data);
                    break;
                case JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR:
                    sendJSONMessageToClient(MessageType.CHOOSE_SESSION.name, SessionChoice.SPECTATOR, action.data);
                    break;
                case JassAppConstants.CREATE_NEW_SESSION:
                    sendJSONMessageToClient(MessageType.CHOOSE_SESSION.name, SessionChoice.CREATE_NEW, action.data);
                    break;
                case JassAppConstants.AUTOJOIN_SESSION:
                    sendJSONMessageToClient(MessageType.CHOOSE_SESSION.name, SessionChoice.AUTOJOIN);
                    break;
                case JassAppConstants.CHOOSE_TRUMPF:
                    sendJSONMessageToClient(MessageType.CHOOSE_TRUMPF.name, action.data);
                    break;
                case JassAppConstants.CHOOSE_CARD:
                    sendJSONMessageToClient(MessageType.CHOOSE_CARD.name, action.data);
                    break;
                case JassAppConstants.START_TOURNAMENT:
                    sendJSONMessageToClient(MessageType.START_TOURNAMENT.name);
                    break;
                case JassAppConstants.JOIN_BOT:
                    sendJSONMessageToClient(MessageType.JOIN_BOT.name, action.data);
                    break;
            }
        }
    },
    handleErrorFromServer: () => {
        JassActions.throwError('WEBSOCKET', 'The connection to the server has been lost!');
    },

    connect: () => {
        webSocket = new WebSocket(serverAddress);
        webSocket.onmessage = ServerApi.handleMessageFromServer;
        webSocket.onerror = ServerApi.handleErrorFromServer;
        JassAppDispatcher.register(ServerApi.handleActionsFromUi);
    }
};

export default ServerApi;
