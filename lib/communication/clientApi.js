'use strict';

let messages = require('./messages');

function toJSON(object) {
    return JSON.stringify(object);
}

function fromJSON(string) {
    try {
        return JSON.parse(string);
    } catch (error) {
        console.error("Bad message from client");
    }
}

let ClientApi = {
    addClient: function addClient(client) {
        this.clients.push(client);
    },

    requestTrumpf : function requestTrumpf(webSocket, pushed) {
        webSocket.send(toJSON(messages.create(messages.MessageType.REQUEST_TRUMP, pushed)));

        return new Promise((resolve) => {
            webSocket.on('message', function handleChooseTrump(message) {
                message = fromJSON(message);

                if (message.type === messages.MessageType.CHOOSE_TRUMP) {
                    webSocket.removeListener('message', handleChooseTrump);
                    resolve(message.data);
                }
            });
        });
    },

    broadcastCardPlayed : function broadcastCardPlayed(playedCard) {
        // TODO
    },

    broadcastTrumpf : function broadcastTrumpf(gameType) {

    }
};

let create = function create() {
    let clientApi = Object.create(ClientApi);
    clientApi.clients = [];
    return clientApi;
};


module.exports = {
    create
};
