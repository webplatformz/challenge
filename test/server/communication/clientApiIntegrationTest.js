'use strict';

let expect = require('chai').expect,
    WebSocket = require('ws'),
    WebSocketServer = require('ws').Server,
    ClientApi = require('../../../server/communication/clientApi'),
    GameType = require('../../../server/game/game').GameType,
    GameMode = require('../../../server/game/gameMode'),
    CardColor = require('../../../shared/deck/card').CardColor,
    Validation = require('../../../server/game/validation/validation'),
    JassSession = require('../../../server/game/session');

let messages = require('../../../shared/messages/messages');

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
        let trumpf = CardColor.SPADES;
        let choosePlayerName = (name) => {
            return messages.create(messages.MessageType.CHOOSE_PLAYER_NAME, name);
        };

        let giveValidCardFromHand = function(tableCards, handCards) {
            let cardToPlay;

            let validation = Validation.create(GameMode.TRUMPF, trumpf);
            handCards.forEach((handCard) => {
                if(validation.validate(tableCards, handCards, handCard)) {
                    cardToPlay = handCard;
                }
            });

            if(cardToPlay === undefined) {
                console.log("########## EPIC FAIL: PLAYER CANNOT PLAY CARD. This should never happen! ###########");
            }
            return cardToPlay;
        };

        function createClient() {
            return new WebSocket('ws://localhost:10001');
        }

        it('should start the game after 4 players have been connected', (done) => {
            let session = JassSession.create();

            wss.on('connection', (ws) => {
                session.addPlayer(ws);
                if (session.isComplete()) {
                    session.start().then((team) => {
                        console.log("Team " + team.name + " won ");
                    });
                    session = JassSession.create();
                }
            });


            let handCards1,
                handCards2,
                handCards3,
                handCards4;

            let client1 = createClient();
            client1.on('message', (messageJson) => {
                let message = JSON.parse(messageJson);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client1.send(JSON.stringify(choosePlayerName("client 1")));
                }

                if (message.type === messages.MessageType.DEAL_CARDS) {
                    handCards1 = message.data;
                }

                if (message.type === messages.MessageType.REQUEST_CARD) {
                    let handCard = giveValidCardFromHand(message.data, handCards1);
                    let chooseCardResonse = messages.create(messages.MessageType.CHOOSE_CARD, handCard);
                    client1.send(JSON.stringify(chooseCardResonse));
                }

                if (message.type === messages.MessageType.REQUEST_TRUMPF) {
                    let gameType = GameType.create(GameMode.TRUMPF, trumpf);
                    let chooseTrumpfResponse = messages.create(messages.MessageType.CHOOSE_TRUMPF, gameType);
                    client1.send(JSON.stringify(chooseTrumpfResponse));
                }
            });

            let client2 = createClient();
            client2.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client2.send(JSON.stringify(choosePlayerName("client 2")));
                }

                if (message.type === messages.MessageType.DEAL_CARDS) {
                    handCards2 = message.data;
                }

                if (message.type === messages.MessageType.REQUEST_CARD) {
                    let handCard = giveValidCardFromHand(message.data, handCards2);
                    let chooseCardResonse = messages.create(messages.MessageType.CHOOSE_CARD, handCard);
                    client2.send(JSON.stringify(chooseCardResonse));
                }
            });

            let client3 = createClient();
            client3.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client3.send(JSON.stringify(choosePlayerName("client 3")));
                }

                if (message.type === messages.MessageType.DEAL_CARDS) {
                    handCards3 = message.data;
                }

                if (message.type === messages.MessageType.REQUEST_CARD) {
                    let handCard = giveValidCardFromHand(message.data, handCards3);
                    let chooseCardResonse = messages.create(messages.MessageType.CHOOSE_CARD, handCard);
                    client3.send(JSON.stringify(chooseCardResonse));
                }
            });



            let client4 = createClient();
            client4.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client4.send(JSON.stringify(choosePlayerName("client 4")));
                }

                if (message.type === messages.MessageType.DEAL_CARDS) {
                    handCards4 = message.data;
                }

                if (message.type === messages.MessageType.REQUEST_CARD) {
                    let handCard = giveValidCardFromHand(message.data, handCards4);
                    let chooseCardResonse = messages.create(messages.MessageType.CHOOSE_CARD, handCard);
                    client4.send(JSON.stringify(chooseCardResonse));
                    done();
                }
            });


        });
    });

});
