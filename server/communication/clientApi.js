'use strict';

let messages = require('../../shared/messages/messages'),
    MessageType = require('../../shared/messages/messageType'),
    clientCommunication = require('./clientCommunication');

function resolveCorrectMessageOrReject(client, expectedMessageType, message, resolve, reject) {
    let messageObject = clientCommunication.fromJSON(message);

    if (messageObject && messageObject.type === expectedMessageType) {
        resolve(messageObject.data);
    } else {
        clientCommunication.send(client, MessageType.BAD_MESSAGE.name, message);
        reject('Invalid client answer: ' + message);
    }
}

let ClientApi = {
    addClient: function addClient(client) {
        this.clients.push(client);

        return new Promise((resolve, reject) => {
            client.on('close', (code, message) => {
                reject({code, message});
            });
        });
    },

    requestPlayerName: function requestPlayerName(client) {
        return clientCommunication.request(client, MessageType.REQUEST_PLAYER_NAME.name,
            resolveCorrectMessageOrReject.bind(null, client, MessageType.CHOOSE_PLAYER_NAME.name));
    },

    broadcastTeams: function broadcastTeams(teams) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TEAMS.name, teams);
    },

    dealCards: function dealCards(client, cards) {
        clientCommunication.send(client, MessageType.DEAL_CARDS.name, cards);
    },

    requestTrumpf: function requestTrumpf(client, pushed) {
        return clientCommunication.request(client, MessageType.REQUEST_TRUMPF.name,
            resolveCorrectMessageOrReject.bind(null, client, MessageType.CHOOSE_TRUMPF.name),
            pushed);
    },

    rejectTrumpf: function rejectTrumpf(client, gameType) {
        clientCommunication.send(client, MessageType.REJECT_TRUMPF.name, gameType);
    },

    broadcastTrumpf: function broadcastTrumpf(gameType) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TRUMPF.name, gameType);
    },

    broadcastCardPlayed: function broadcastCardPlayed(playedCards) {
        clientCommunication.broadcast(this.clients, MessageType.PLAYED_CARDS.name, playedCards);
    },

    broadcastStich: function broadcastStich(winner) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_STICH.name, winner);
    },

    broadcastGameFinished: function broadcastStich(teams) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_GAME_FINISHED.name, teams);
    },

    broadcastWinnerTeam: function broadcastWinnerTeam(team) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_WINNER_TEAM.name, team);
    },

    requestCard: function requestCard(client, cardsOnTable) {
        return clientCommunication.request(client, MessageType.REQUEST_CARD.name,
            resolveCorrectMessageOrReject.bind(null, client, MessageType.CHOOSE_CARD.name),
            cardsOnTable);
    },

    rejectCard: function rejectCard(client, card, cardsOnTable) {
        clientCommunication.send(client, MessageType.REJECT_CARD.name, card, cardsOnTable);
    },

    requestSessionChoice: function requestSessionChoice(client, availableSessions) {
        return clientCommunication.request(client, MessageType.REQUEST_SESSION_CHOICE.name,
            resolveCorrectMessageOrReject.bind(null, client, MessageType.CHOOSE_SESSION.name),
            availableSessions);
    },

    broadcastSessionJoined: function broadcastSessionJoined(name, id) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_SESSION_JOINED.name, name, id);
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
