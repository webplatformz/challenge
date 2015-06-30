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

function broadcast(clients, messageType, data) {
    clients.forEach((client) => {
        client.send(toJSON(messages.create(messageType, data)));
    });
}

let ClientApi = {
    addClient: function addClient(client) {
        this.clients.push(client);
    },

    requestTrumpf : function requestTrumpf(webSocket, pushed) {
        webSocket.send(toJSON(messages.create(messages.MessageType.REQUEST_TRUMPF, pushed)));

        return new Promise((resolve) => {
            webSocket.on('message', function handleChooseTrump(message) {
                message = fromJSON(message);

                if (message.type === messages.MessageType.CHOOSE_TRUMPF) {
                    webSocket.removeListener('message', handleChooseTrump);
                    resolve(message.data);
                }
            });
        });
    },

    broadcastCardPlayed : function broadcastCardPlayed(playedCards) {
        broadcast(this.clients, messages.MessageType.CARDS_PLAYED, playedCards);
    },

    broadcastTrumpf : function broadcastTrumpf(gameType) {
        broadcast(this.clients, messages.MessageType.BROADCAST_TRUMPF, gameType);
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
