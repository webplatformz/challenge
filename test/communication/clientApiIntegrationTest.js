'use strict';

let expect = require('chai').expect,
    WebSocket = require('ws'),
    WebSocketServer = require('ws').Server,
    ClientApi = require('../../lib/communication/clientApi'),
    GameType = require('../../lib/game/game').GameType,
    GameMode = require('../../lib/game/gameMode'),
    CardColor = require('../../lib/game/deck/card').CardColor;
let JassSession = require('../../lib/game/session');

let messages = require('../../lib/communication/messages');

describe('Integration test', () => {

    let wss,
        clientApi;

    beforeEach(() => {
        wss = new WebSocketServer({port: 10001});
        clientApi = ClientApi.create();
    });

    afterEach(() => {
        wss.close();
    });

    describe('addClient', () => {
        let choosePlayerName = (name) => {
            return messages.create(messages.MessageType.CHOOSE_PLAYER_NAME, name);
        };

        it('should start the game after 4 players have been connected', (done) => {
            let session = JassSession.create();

            wss.on('connection', (ws) => {
                session.addPlayer(ws);
                console.log("player connected");
                if (session.isComplete()) {
                    console.log("session complete");
                    session.start().then((team) => {
                        console.log("Team " + team.name + " won ");
                    });
                    session = JassSession.create();
                }
            });


            let client1 = new WebSocket('ws://localhost:10001');
            client1.on('message', (message) => {
                //console.log("client1 " + message);
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client1.send(JSON.stringify(choosePlayerName("client 1")));
                }

                if (message.type === messages.MessageType.REQUEST_TRUMPF) {
                    let gameType = GameType.create(GameMode.TRUMPF, CardColor.SPADES);
                    let requestTrumpfResponse = messages.create(messages.MessageType.REQUEST_TRUMPF, gameType);
                    client1.send(JSON.stringify(requestTrumpfResponse));
                    done();
                }
            });

            let client2 = new WebSocket('ws://localhost:10001');
            client2.on('message', (message) => {
                //console.log("client2 " + message);
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client2.send(JSON.stringify(choosePlayerName("client 2")));
                }
            });

            let client3 = new WebSocket('ws://localhost:10001');
            client3.on('message', (message) => {
                //console.log("client3 " + message);
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client3.send(JSON.stringify(choosePlayerName("client 3")));
                }
            });

            let client4 = new WebSocket('ws://localhost:10001');
            client4.on('message', (message) => {
                //console.log("client4 " + message);
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client4.send(JSON.stringify(choosePlayerName("client 4")));
                }
            });


        });
    });

});
