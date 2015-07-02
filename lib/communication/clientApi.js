'use strict';

let messages = require('./messages'),
    clientCommunication = require('./clientCommunication');

function resolveCorrectMessageOrReject(client, expectedMessageType, message, resolve, reject) {
    let messageObject = clientCommunication.fromJSON(message);

    if (messageObject && messageObject.type === expectedMessageType) {
        client.removeListener('message', resolveCorrectMessageOrReject);
        resolve(messageObject.data);
    } else {
        reject('Invalid client answer: ' + message);
    }
}

let ClientApi = {
    addClient: function addClient(client) {
        this.clients.push(client);
    },

    requestPlayerName: function requestPlayerName(client) {
        return clientCommunication.request(client, messages.MessageType.REQUEST_PLAYER_NAME,
            resolveCorrectMessageOrReject.bind(null, client, messages.MessageType.CHOOSE_PLAYER_NAME));
    },

    dealCards: function dealCards(client, cards) {
        clientCommunication.send(client, messages.MessageType.DEAL_CARDS, cards);
    },

    requestTrumpf: function requestTrumpf(client, pushed) {
        return clientCommunication.request(client, messages.MessageType.REQUEST_TRUMPF,
            resolveCorrectMessageOrReject.bind(null, client, messages.MessageType.CHOOSE_TRUMPF),
            pushed);
    },

    broadcastTrumpf: function broadcastTrumpf(gameType) {
        clientCommunication.broadcast(this.clients, messages.MessageType.BROADCAST_TRUMPF, gameType);
    },

    broadcastCardPlayed: function broadcastCardPlayed(playedCards) {
        clientCommunication.broadcast(this.clients, messages.MessageType.PLAYED_CARDS, playedCards);
    },

    requestCard: function requestCard(client, cardsOnTable) {
        return clientCommunication.request(client, messages.MessageType.REQUEST_CARD,
            resolveCorrectMessageOrReject.bind(null, client, messages.MessageType.CHOOSE_CARD),
            cardsOnTable);
    },

    rejectCard: function rejectCard(client, card, cardsOnTable) {
        return clientCommunication.request(client, messages.MessageType.REJECT_CARD,
            resolveCorrectMessageOrReject.bind(null, client, messages.MessageType.CHOOSE_CARD),
            card,
            cardsOnTable);
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
