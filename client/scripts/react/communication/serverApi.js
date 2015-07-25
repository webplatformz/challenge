'use strict';

const serverAddress = 'ws://' + window.location.host;
const pingIntervall = 30000;

let ServerApi = {
    handleMessage: (messageEvent) => {
        console.log(messageEvent.data);
    }
};

let webSocket = new WebSocket(serverAddress);
webSocket.onmessage = ServerApi.handleMessage;

module.exports = ServerApi;
