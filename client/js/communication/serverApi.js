'use strict';

const serverAddress = 'ws://' + window.location.host;

let JassAppDispatcher = require('../jassAppDispatcher');
let JassAppConstants = require('../jassAppConstants');
let JassActions = require('../jassActions');
let messages = require('../../../shared/messages/messages');
let MessageType = require('../../../shared/messages/messageType');

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
                default:
                    console.log(action);
            }
        }
    }
};

webSocket.onmessage = ServerApi.handleMessageFromServer;
JassAppDispatcher.register(ServerApi.handleActionsFromUi);

module.exports = ServerApi;
