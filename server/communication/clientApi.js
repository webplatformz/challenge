import { MessageType } from '../../shared/messages/messageType';
import ClientCommunication from './clientCommunication';
import _ from 'lodash';
import WebSocket from 'ws';
import { Logger } from '../logger';
import CloseEventCode from './closeEventCode';

const ClientApi = {
    addClient(client) {
        this.clients.push(client);
        return new Promise((resolve, reject) => {
            const closeHandler = (code, message) => {
                this.clients = this.clients.filter((actClient) => {
                    return actClient !== client;
                });
                reject({ code, message });
            };
            client.on('close', closeHandler);
            this.disposeFunctions.push(() => client.removeEventListener('close', closeHandler));
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
        return this.clientCommunication.request(client, MessageType.REQUEST_PLAYER_NAME.name, MessageType.CHOOSE_PLAYER_NAME, this.timeoutInSeconds);
    },

    broadcastTeams(teams) {
        this.clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TEAMS.name, teams);
    },

    dealCards(client, cards) {
        this.clientCommunication.send(client, MessageType.DEAL_CARDS.name, cards);
    },

    requestTrumpf(client, pushed) {
        return this.clientCommunication.request(client, MessageType.REQUEST_TRUMPF.name, MessageType.CHOOSE_TRUMPF, this.timeoutInSeconds, pushed);
    },

    rejectTrumpf(client, gameType) {
        this.clientCommunication.send(client, MessageType.REJECT_TRUMPF.name, gameType);
    },

    broadcastTrumpf(gameType) {
        this.clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TRUMPF.name, gameType);
    },

    broadcastCardPlayed(playedCards) {
        this.clientCommunication.broadcast(this.clients, MessageType.PLAYED_CARDS.name, playedCards);
    },

    broadcastStich(winner) {
        this.clientCommunication.broadcast(this.clients, MessageType.BROADCAST_STICH.name, winner);
    },

    broadcastGameFinished(teams) {
        this.clientCommunication.broadcast(this.clients, MessageType.BROADCAST_GAME_FINISHED.name, teams);
    },

    broadcastWinnerTeam(team) {
        this.clientCommunication.broadcast(this.clients, MessageType.BROADCAST_WINNER_TEAM.name, team);
    },

    requestCard(client, cardsOnTable) {
        return this.clientCommunication.request(client, MessageType.REQUEST_CARD.name, MessageType.CHOOSE_CARD, this.timeoutInSeconds, cardsOnTable);
    },

    rejectCard(client, card, cardsOnTable) {
        this.clientCommunication.send(client, MessageType.REJECT_CARD.name, card, cardsOnTable);
    },

    requestSessionChoice(client, availableSessions) {
        return this.clientCommunication.request(client, MessageType.REQUEST_SESSION_CHOICE.name, MessageType.CHOOSE_SESSION, this.timeoutInSeconds, availableSessions);
    },

    sessionJoined(client, sessionName, player, playersInSession) {
        this.clientCommunication.send(client, MessageType.SESSION_JOINED.name, sessionName, player, playersInSession);
    },

    broadcastSessionJoined(sessionName, player, playersInSession) {
        this.clientCommunication.broadcast(this.clients, MessageType.BROADCAST_SESSION_JOINED.name, sessionName, player, playersInSession);
    },

    broadcastTournamentRankingTable(rankingTable) {
        this.clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name, rankingTable);
    },

    sendTournamentRankingTable(client, rankingTable) {
        this.clientCommunication.send(client, MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name, rankingTable);
    },
    sendRegistryBots(client, registryBots){
        this.clientCommunication.send(client, MessageType.SEND_REGISTRY_BOTS.name, registryBots);
    },
    waitForTournamentStart(client) {
        return this.clientCommunication.await(client, MessageType.START_TOURNAMENT);
    },

    broadcastTournamentStarted() {
        this.clientCommunication.broadcast(this.clients, MessageType.BROADCAST_TOURNAMENT_STARTED.name);
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
    },

    subscribeMessage(client, messageType, messageHandler) {
        return this.clientCommunication.on(client, messageType, messageHandler);
    },

    setCommunicationProxy(proxyHandler) {
        this.clientCommunication = new Proxy(ClientCommunication, proxyHandler);
    },

    dispose() {
        this.disposeFunctions = this.disposeFunctions
            .map(disposeFunction => disposeFunction())
            .filter(disposeResult => disposeResult);
    }
};

export function create(timeoutInMilliseconds = 0) {
    let clientApi = Object.create(ClientApi);
    clientApi.clients = [];
    clientApi.disposeFunctions = [];
    clientApi.timeoutInSeconds = timeoutInMilliseconds;
    clientApi.clientCommunication = ClientCommunication;
    return clientApi;
}
