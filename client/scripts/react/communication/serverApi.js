'use strict';

const serverAddress = 'ws://' + window.location.host;

let ServerApi = {
    handleMessage: (messageEvent) => {
        console.log(messageEvent.data);
    }
};

let webSocket = new WebSocket(serverAddress);
webSocket.onmessage = ServerApi.handleMessage;

module.exports = ServerApi;
