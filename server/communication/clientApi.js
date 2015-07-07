'use strict';

let messages = require('../../shared/messages/messages'),
    clientCommunication = require('./clientCommunication');

function resolveCorrectMessageOrReject(expectedMessageType, message, resolve, reject) {
    let messageObject = clientCommunication.fromJSON(message);

    if (messageObject && messageObject.type === expectedMessageType) {
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
            resolveCorrectMessageOrReject.bind(null, messages.MessageType.CHOOSE_PLAYER_NAME));
    },

    dealCards: function dealCards(client, cards) {
        clientCommunication.send(client, messages.MessageType.DEAL_CARDS, cards);
    },

    requestTrumpf: function requestTrumpf(client, pushed) {
        return clientCommunication.request(client, messages.MessageType.REQUEST_TRUMPF,
            resolveCorrectMessageOrReject.bind(null, messages.MessageType.CHOOSE_TRUMPF),
            pushed);
    },

    broadcastTrumpf: function broadcastTrumpf(gameType) {
        clientCommunication.broadcast(this.clients, messages.MessageType.BROADCAST_TRUMPF, gameType);
    },

    broadcastCardPlayed: function broadcastCardPlayed(playedCards) {
        clientCommunication.broadcast(this.clients, messages.MessageType.PLAYED_CARDS, playedCards);
    },

    broadcastStich: function broadcastStich(winner) {
        clientCommunication.broadcast(this.clients, messages.MessageType.BROADCAST_STICH, winner);
    },
    
    broadcastGameFinished: function broadcastStich(teams) {
        clientCommunication.broadcast(this.clients, messages.MessageType.BROADCAST_GAME_FINISHED, teams);
    },

    broadcastWinnerTeam: function broadcastWinnerTeam(team) {
        clientCommunication.broadcast(this.clients, messages.MessageType.BROADCAST_WINNER_TEAM, team);
    },

    requestCard: function requestCard(client, cardsOnTable) {
        return clientCommunication.request(client, messages.MessageType.REQUEST_CARD,
            resolveCorrectMessageOrReject.bind(null, messages.MessageType.CHOOSE_CARD),
            cardsOnTable);
    },

    rejectCard: function rejectCard(client, card, cardsOnTable) {
        clientCommunication.send(client, messages.MessageType.REJECT_CARD, card, cardsOnTable);
    },

    requestSessionChoice: function requestSessionChoice(client, availableSessions) {
        return clientCommunication.request(client, messages.MessageType.REQUEST_SESSION_CHOICE,
            resolveCorrectMessageOrReject.bind(null, messages.MessageType.CHOOSE_SESSION),
            availableSessions);
    },

    closeAll: function closeAll(code, message) {
        this.clients.forEach((client) => {
            client.close(code, message);
        });
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
