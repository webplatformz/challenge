'use strict';

import {MessageType} from '../../shared/messages/messageType.js';
import ClientCommunication from './clientCommunication';
import validate from 'validate.js';
import _ from 'lodash';
import WebSocket from 'ws';
import {Logger} from '../logger.js';
import CloseEventCode from './closeEventCode';


function resolveCorrectMessageOrReject(client, expectedMessageType, message, resolve, reject) {
    let messageObject = ClientCommunication.fromJSON(message);

    if (messageObject && messageObject.type === expectedMessageType.name) {
        let validationResult = validate(messageObject, expectedMessageType.constraints);

        if (validationResult) {
            ClientCommunication.send(client, MessageType.BAD_MESSAGE.name, validationResult);
            reject(validationResult);
        }

        let cleanedMessageObject = validate.cleanAttributes(messageObject, expectedMessageType.constraints);
        resolve(cleanedMessageObject.data);
    } else {
        ClientCommunication.send(client, MessageType.BAD_MESSAGE.name, message);
        reject('Invalid Message: ' + message + ', expected message with type: ' + expectedMessageType.name);
    }
}

const ClientApi = {
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
        return ClientCommunication.request(client, MessageType.REQUEST_PLAYER_NAME.name,
            (message, resolve, reject) => resolveCorrectMessageOrReject(client, MessageType.CHOOSE_PLAYER_NAME, message, resolve, reject));
    },

    broadcastTeams(teams) {
        ClientCommunication.broadcast(this.clients, MessageType.BROADCAST_TEAMS.name, teams);
    },

    dealCards(client, cards) {
        ClientCommunication.send(client, MessageType.DEAL_CARDS.name, cards);
    },

    requestTrumpf(client, pushed) {
        return ClientCommunication.request(client, MessageType.REQUEST_TRUMPF.name,
            (message, resolve, reject) => resolveCorrectMessageOrReject(client, MessageType.CHOOSE_TRUMPF, message, resolve, reject),
            pushed);
    },

    rejectTrumpf(client, gameType) {
        ClientCommunication.send(client, MessageType.REJECT_TRUMPF.name, gameType);
    },

    broadcastTrumpf(gameType) {
        ClientCommunication.broadcast(this.clients, MessageType.BROADCAST_TRUMPF.name, gameType);
    },

    broadcastCardPlayed(playedCards) {
        ClientCommunication.broadcast(this.clients, MessageType.PLAYED_CARDS.name, playedCards);
    },

    broadcastStich(winner) {
        ClientCommunication.broadcast(this.clients, MessageType.BROADCAST_STICH.name, winner);
    },

    broadcastGameFinished(teams) {
        ClientCommunication.broadcast(this.clients, MessageType.BROADCAST_GAME_FINISHED.name, teams);
    },

    broadcastWinnerTeam(team) {
        ClientCommunication.broadcast(this.clients, MessageType.BROADCAST_WINNER_TEAM.name, team);
    },

    requestCard(client, cardsOnTable) {
        return ClientCommunication.request(client, MessageType.REQUEST_CARD.name,
            (message, resolve, reject) => resolveCorrectMessageOrReject(client, MessageType.CHOOSE_CARD, message, resolve, reject),
            cardsOnTable);
    },

    rejectCard(client, card, cardsOnTable) {
        ClientCommunication.send(client, MessageType.REJECT_CARD.name, card, cardsOnTable);
    },

    requestSessionChoice(client, availableSessions) {
        return ClientCommunication.request(client, MessageType.REQUEST_SESSION_CHOICE.name,
            (message, resolve, reject) => resolveCorrectMessageOrReject(client, MessageType.CHOOSE_SESSION, message, resolve, reject),
            availableSessions);
    },

    sessionJoined(client, sessionName, player, playersInSession) {
        ClientCommunication.send(client, MessageType.SESSION_JOINED.name, sessionName, player, playersInSession);
    },

    broadcastSessionJoined(sessionName, player, playersInSession) {
        ClientCommunication.broadcast(this.clients, MessageType.BROADCAST_SESSION_JOINED.name, sessionName, player, playersInSession);
    },

    broadcastTournamentRankingTable(rankingTable) {
        ClientCommunication.broadcast(this.clients, MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name, rankingTable);
    },

    sendTournamentRankingTable(client, rankingTable) {
        ClientCommunication.send(client, MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name, rankingTable);
    },

    waitForTournamentStart(client) {
        return ClientCommunication.await(client, MessageType.START_TOURNAMENT);
    },

    broadcastTournamentStarted() {
        ClientCommunication.broadcast(this.clients, MessageType.BROADCAST_TOURNAMENT_STARTED.name);
    },

    closeAll(message) {
        this.clients.forEach((client) => this.close(client, message));
    },

    close(client, message) {
        try {
            client.close(CloseEventCode.NORMAL, message);
        } catch (e) {
            Logger.error(e);
        }
    }
};

export function create() {
    let clientApi = Object.create(ClientApi);
    clientApi.clients = [];
    return clientApi;
}