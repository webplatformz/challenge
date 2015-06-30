'use strict';

let messages = require('./messages'),
    clientCommunication = require('./clientCommunication');

let ClientApi = {
    addClient: function addClient(client) {
        this.clients.push(client);
    },

    dealCards: function dealCards(client, cards) {
        clientCommunication.send(client, messages.MessageType.DEAL_CARDS, cards);
    },

    requestTrumpf: function requestTrumpf(client, pushed) {
        return clientCommunication.request(client, messages.MessageType.REQUEST_TRUMPF, function handleChooseTrump(message, resolve, reject) {
            message = clientCommunication.fromJSON(message);

            if (message.type === messages.MessageType.CHOOSE_TRUMPF) {
                client.removeListener('message', handleChooseTrump);
                resolve(message.data);
            } else {
                reject('Invalid client answer');
            }
        }, pushed);
    },

    broadcastTrumpf: function broadcastTrumpf(gameType) {
        clientCommunication.broadcast(this.clients, messages.MessageType.BROADCAST_TRUMPF, gameType);
    },

    broadcastCardPlayed: function broadcastCardPlayed(playedCards) {
        clientCommunication.broadcast(this.clients, messages.MessageType.PLAYED_CARDS, playedCards);
    },

    requestCard: function requestCard(client, cardsOnTable) {

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
