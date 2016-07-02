import JassAppDispatcher from '../jassAppDispatcher';
import JassAppConstants from '../jassAppConstants';
import JassActions from '../jassActions';
import * as messages from '../../../shared/messages/messages';
import {MessageType} from '../../../shared/messages/messageType';
import {SessionChoice} from '../../../shared/session/sessionChoice';

const protocol = (window.location.hostname === 'localhost') ? 'ws' : 'wss';
const serverAddress = `${protocol}://${window.location.host}`;

let webSocket;

function sendJSONMessageToClient(messageType, ...data) {
    webSocket.send(JSON.stringify(messages.create(messageType, ...data)));
}

function createErrorAction(data, source) {
    return {
        type: JassAppConstants.ERROR,
        data,
        source
    };
}

const ServerApi = {
    handleMessageFromServer(dispatch, messageEvent) {
        let {data, type} = JSON.parse(messageEvent.data);

        switch (type) {
            case MessageType.BAD_MESSAGE:
                dispatch(createErrorAction(data, 'SERVER'));
                break;
            case MessageType.REQUEST_PLAYER_NAME.name:
                JassActions.requestPlayerName();
                break;
            case MessageType.REQUEST_SESSION_CHOICE.name:
                JassActions.requestSessionChoice(data);
                break;
            case MessageType.SESSION_JOINED.name:
            case MessageType.BROADCAST_SESSION_JOINED.name:
                dispatch({
                    type: JassAppConstants.SESSION_JOINED,
                    data
                });
                JassActions.sessionJoined(data);
                break;
            case MessageType.BROADCAST_TEAMS.name:
                JassActions.broadcastTeams(data);
                break;
            case MessageType.DEAL_CARDS.name:
                JassActions.dealCards(data);
                break;
            case MessageType.REQUEST_TRUMPF.name:
                JassActions.requestTrumpf(data);
                break;
            case MessageType.BROADCAST_TRUMPF.name:
                JassActions.broadastTrumpf(data);
                break;
            case MessageType.REQUEST_CARD.name:
                JassActions.requestCard(data);
                break;
            case MessageType.REJECT_CARD.name:
                JassActions.rejectCard(data);
                break;
            case MessageType.PLAYED_CARDS.name:
                JassActions.playedCards(data);
                break;
            case MessageType.BROADCAST_STICH.name:
                JassActions.broadcastStich(data);
                break;
            case MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name:
                dispatch({
                    type: JassAppConstants.BROADCAST_TOURNAMENT_RANKING_TABLE,
                    data
                });
                JassActions.broadcastTournamentRankingTable(data);
                break;
            case MessageType.BROADCAST_TOURNAMENT_STARTED.name:
                JassActions.broadcastTournamentStarted();
                break;
            case MessageType.SEND_REGISTRY_BOTS.name:
                JassActions.sendRegistryBots(data);
                break;
        }
    },
    handleActionsFromUi(payload) {
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

    handleErrorFromServer(dispatch) {
        dispatch(createErrorAction('The connection to the server has been lost!', 'WEBSOCKET'));
    },

    connect(storeDispatchFunction) {
        webSocket = new WebSocket(serverAddress);
        webSocket.onmessage = (message) => this.handleMessageFromServer(storeDispatchFunction, message);
        webSocket.onerror = (message) => this.handleErrorFromServer(storeDispatchFunction, message);
        webSocket.onclose = () => storeDispatchFunction(createErrorAction('Server closed connection', 'WEBSOCKET'));
        JassAppDispatcher.register(this.handleActionsFromUi);
    }
};

export default ServerApi;
