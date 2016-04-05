'use strict';

import MessageType from '../../shared/messages/messageType.js';
import clientCommunication from './clientCommunication';
import validate from 'validate.js';
import _ from 'lodash';
import WebSocket from 'ws';
import Logger from '../logger.js';
import CloseEventCode from './closeEventCode';


function resolveCorrectMessageOrReject(client, expectedMessageType, message, resolve, reject) {
    let messageObject = clientCommunication.fromJSON(message);

    if (messageObject && messageObject.type === expectedMessageType.name) {
        let validationResult = validate(messageObject, expectedMessageType.constraints);

        if (validationResult) {
            clientCommunication.send(client, MessageType.BAD_MESSAGE.name, validationResult);
            reject(validationResult);
        }

        let cleanedMessageObject = validate.cleanAttributes(messageObject, expectedMessageType.constraints);
        resolve(cleanedMessageObject.data);
    } else {
        clientCommunication.send(client, MessageType.BAD_MESSAGE.name, message);
        reject('Invalid Message: ' + message + ', expected message with type: ' + expectedMessageType.name);
    }
}

let ClientApi = {
    addClient(client) {
        this.clients.push(client);

        return new Promise((resolve, reject) => {
            client.on('close', (code, message) => {
                this.clients = this.clients.filter((actClient) => {
                    return actClient !== client;
                });
                reject({code, message});
            });
        });
    },

    removeClient(client, message) {
        if (client.readyState === WebSocket.OPEN) {
            this.close(client, message);
        }

        _.remove(this.clients, (actClient) => {
            return actClient === client;
        });
    },

    requestPlayerName(client) {
        return clientCommunication.request(client, MessageType.REQUEST_PLAYER_NAME.name,
            resolveCorrectMessageOrReject.bind(null, client, MessageType.CHOOSE_PLAYER_NAME));
    },

    broadcastTeams(teams) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TEAMS.name, teams);
    },

    dealCards(client, cards) {
        clientCommunication.send(client, MessageType.DEAL_CARDS.name, cards);
    },

    requestTrumpf(client, pushed) {
        return clientCommunication.request(client, MessageType.REQUEST_TRUMPF.name,
            resolveCorrectMessageOrReject.bind(null, client, MessageType.CHOOSE_TRUMPF),
            pushed);
    },

    rejectTrumpf(client, gameType) {
        clientCommunication.send(client, MessageType.REJECT_TRUMPF.name, gameType);
    },

    broadcastTrumpf(gameType) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TRUMPF.name, gameType);
    },

    broadcastCardPlayed(playedCards) {
        clientCommunication.broadcast(this.clients, MessageType.PLAYED_CARDS.name, playedCards);
    },

    broadcastStich(winner) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_STICH.name, winner);
    },

    broadcastGameFinished(teams) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_GAME_FINISHED.name, teams);
    },

    broadcastWinnerTeam(team) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_WINNER_TEAM.name, team);
    },

    requestCard(client, cardsOnTable) {
        return clientCommunication.request(client, MessageType.REQUEST_CARD.name,
            resolveCorrectMessageOrReject.bind(null, client, MessageType.CHOOSE_CARD),
            cardsOnTable);
    },

    rejectCard(client, card, cardsOnTable) {
        clientCommunication.send(client, MessageType.REJECT_CARD.name, card, cardsOnTable);
    },

    requestSessionChoice(client, availableSessions) {
        return clientCommunication.request(client, MessageType.REQUEST_SESSION_CHOICE.name,
            resolveCorrectMessageOrReject.bind(null, client, MessageType.CHOOSE_SESSION),
            availableSessions);
    },

    broadcastSessionJoined(sessionName, player, playersInSession) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_SESSION_JOINED.name, sessionName, player, playersInSession);
    },

    broadcastTournamentRankingTable(rankingTable) {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name, rankingTable);
    },

    sendTournamentRankingTable(client, rankingTable) {
        clientCommunication.send(client, MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name, rankingTable);
    },

    waitForTournamentStart(client) {
        return clientCommunication.await(client, MessageType.START_TOURNAMENT);
    },

    broadcastTournamentStarted() {
        clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TOURNAMENT_STARTED.name);
    },

    closeAll: function closeAll(message) {
        this.clients.forEach((client) => this.close(client, message));
    },
    
    close(client, message) {
        console.error(arguments);
        try {
            client.close(CloseEventCode.NORMAL, message);
        } catch(e) {
            Logger.error(e);
        }
    }
};

export default {
    create() {
        let clientApi = Object.create(ClientApi);
        clientApi.clients = [];
        return clientApi;
    }
};