'use strict';

const serverAddress = 'ws://' + window.location.host;

let JassAppDispatcher = require('../jassAppDispatcher');
let JassAppConstants = require('../jassAppConstants');
let JassActions = require('../jassActions');
let messages = require('../../../shared/messages/messages');
let MessageType = require('../../../shared/messages/messageType');
let SessionChoice = require('../../../shared/game/sessionChoice');

let webSocket = new WebSocket(serverAddress);

function sendJSONMessageToClient(messageType, ...data) {
    webSocket.send(JSON.stringify(messages.create(messageType, ...data)));
}

let ServerApi = {
    handleMessageFromServer: (messageEvent) => {
        let message = JSON.parse(messageEvent.data);

        switch(message.type) {
            case MessageType.REQUEST_PLAYER_NAME.name:
                JassActions.requestPlayerName();
                break;
            case MessageType.REQUEST_SESSION_CHOICE.name:
                JassActions.requestSessionChoice(message.data);
                break;
            case MessageType.BROADCAST_SESSION_JOINED.name:
                JassActions.sessionJoined(message.data);
                break;
            default:
                console.log(message);
        }
    },
    handleActionsFromUi: (payload) => {
        if (payload.source === 'VIEW_ACTION') {
            let action = payload.action;

            switch (action.actionType) {
                case JassAppConstants.CHOOSE_PLAYER_NAME:
                    sendJSONMessageToClient(MessageType.CHOOSE_PLAYER_NAME.name, action.data);
                    break;
                case JassAppConstants.CHOOSE_EXISTING_SESSION:
                    sendJSONMessageToClient(MessageType.CHOOSE_SESSION.name, SessionChoice.JOIN_EXISTING, action.data);
                    break;
                case JassAppConstants.CREATE_NEW_SESSION:
                    sendJSONMessageToClient(MessageType.CHOOSE_SESSION.name, SessionChoice.CREATE_NEW, action.data);
                    break;
                case JassAppConstants.AUTOJOIN_SESSION:
                    sendJSONMessageToClient(MessageType.CHOOSE_SESSION.name, SessionChoice.AUTOJOIN);
                    break;
                default:
                    console.log(action);
            }
        }
    }
};

webSocket.onmessage = ServerApi.handleMessageFromServer;
JassAppDispatcher.register(ServerApi.handleActionsFromUi);

module.exports = ServerApi;
