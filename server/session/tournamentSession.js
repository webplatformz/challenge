'use strict';

import ClientApi from '../communication/clientApi.js';
import SessionType from '../../shared/session/sessionType.js';
import CloseEventCode from '../communication/closeEventCode.js';
import {polyfill} from 'babel';

let TournamentSession = {
    type: SessionType.TOURNAMENT,

    addPlayer: function (webSocket, playerName) {
        this.clientApi.addClient(webSocket);

        let player = this.players.find((actPlayer) => {
            return actPlayer.playerName === playerName;
        });

        if (player) {
            if (player.clients.length < 2) {
                player.clients.push(webSocket);
            } else {
                this.clientApi.removeClient(webSocket, CloseEventCode.ABNORMAL, 'This Player already has two registered clients!');
            }
        } else {
            this.players.push({
                playerName,
                clients: [
                    webSocket
                ]
            });
        }
    },

    addSpectator: function (webSocket) {

    },

    isComplete: function () {
        return false;
    },

    start: function () {

    },

    close: function close(code, message) {

    }
};

module.exports = {
    create: (sessionName) => {
        let session = Object.create(TournamentSession);
        session.name = sessionName;
        session.players = [];
        session.spectators = [];
        session.clientApi = ClientApi.create();
        return session;
    }
};