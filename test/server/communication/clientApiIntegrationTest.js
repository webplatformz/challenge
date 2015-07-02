'use strict';

let expect = require('chai').expect,
    WebSocket = require('ws'),
    WebSocketServer = require('ws').Server,
    ClientApi = require('../../../server/communication/clientApi'),
    GameType = require('../../../server/game/game').GameType,
    GameMode = require('../../../server/game/gameMode'),
    CardColor = require('../../../server/game/deck/card').CardColor,
    Validation = require('../../../server/game/validation/validation'),
    JassSession = require('../../../server/game/session');

let messages = require('../../../server/communication/messages');

describe.skip('Integration test', () => {

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
                console.log("#########################333 epic fail #################################");
            }

            console.log("client " + JSON.stringify(tableCards) + " hand " + JSON.stringify(handCards) + " card to play " + JSON.stringify(cardToPlay));
            return cardToPlay;
        };

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


            let client1 = new WebSocket('ws://localhost:10001');
            let handCards1,
                handCards2,
                handCards3,
                handCards4;
            client1.on('message', (messageJson) => {
                //console.log("client1 " + message);
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

            let client2 = new WebSocket('ws://localhost:10001');
            client2.on('message', (message) => {
                //console.log("client2 " + message);
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client2.send(JSON.stringify(choosePlayerName("client 2")));
                }

                if (message.type === messages.MessageType.DEAL_CARDS) {
                    handCards2 = message.data;
                }

                if (message.type === messages.MessageType.REQUEST_CARD) {
                    console.log("choosing card 2");
                    let handCard = giveValidCardFromHand(message.data, handCards2);
                    let chooseCardResonse = messages.create(messages.MessageType.CHOOSE_CARD, handCard);
                    client2.send(JSON.stringify(chooseCardResonse));
                }
            });

            let client3 = new WebSocket('ws://localhost:10001');
            client3.on('message', (message) => {
                //console.log("client3 " + message);
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client3.send(JSON.stringify(choosePlayerName("client 3")));
                }

                if (message.type === messages.MessageType.DEAL_CARDS) {
                    handCards3 = message.data;
                }

                if (message.type === messages.MessageType.REQUEST_CARD) {
                    done();
                    console.log("hand cards 3: " + handCards3);
                    let handCard = giveValidCardFromHand(message.data, handCards3);
                    let chooseCardResonse = messages.create(messages.MessageType.CHOOSE_CARD, handCard);
                    client3.send(JSON.stringify(chooseCardResonse));
                }
            });

            let client4 = new WebSocket('ws://localhost:10001');
            client4.on('message', (message) => {
                //console.log("client4 " + message);
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client4.send(JSON.stringify(choosePlayerName("client 4")));
                }

                if (message.type === messages.MessageType.DEAL_CARDS) {
                    handCards4 = message.data;
                }

                if (message.type === messages.MessageType.REQUEST_CARD) {
                    //let handCard = giveValidCardFromHand(message.data, handCards4);
                    //let chooseCardResonse = messages.create(messages.MessageType.CHOOSE_CARD, handCard);
                    //client3.send(JSON.stringify(chooseCardResonse));
                    console.log("finish");
                }
            });


        });
    });

});
