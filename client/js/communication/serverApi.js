'use strict';

const serverAddress = 'ws://' + window.location.host;

let JassAppDispatcher = require('../jassAppDispatcher');
let JassActions = require('../jassActions');
let webSocket = new WebSocket(serverAddress);
let MessageType = require('../../../shared/messages/messageType');

let ServerApi = {
    handleMessageFromServer: (messageEvent) => {
        var message = JSON.parse(messageEvent.data);
        switch(message.type) {
            case MessageType.REQUEST_PLAYER_NAME.name:
                JassActions.requestPlayerName();
                break;
            default:
                console.log(message);
        }
    },
    handleActionsFromUi: (payload) => {
        console.log(payload);
    }
};

webSocket.onmessage = ServerApi.handleMessageFromServer;
JassAppDispatcher.register(ServerApi.handleActionsFromUi);

module.exports = ServerApi;
