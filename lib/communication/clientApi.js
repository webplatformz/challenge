'use strict';

let messages = require('./messages'),
    clientCommunication = require('./clientCommunication');

let ClientApi = {
    addClient: function addClient(client) {
        this.clients.push(client);
    },

    requestTrumpf: function requestTrumpf(client, pushed) {
        return clientCommunication.request(client, messages.MessageType.REQUEST_TRUMPF, function handleChooseTrump(message, resolve) {
            message = clientCommunication.fromJSON(message);

            if (message.type === messages.MessageType.CHOOSE_TRUMPF) {
                client.removeListener('message', handleChooseTrump);
                resolve(message.data);
            }
        }, pushed);
    },

    broadcastCardPlayed: function broadcastCardPlayed(playedCards) {
        clientCommunication.broadcast(this.clients, messages.MessageType.PLAYED_CARDS, playedCards);
    },

    broadcastTrumpf: function broadcastTrumpf(gameType) {
        clientCommunication.broadcast(this.clients, messages.MessageType.BROADCAST_TRUMPF, gameType);
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
