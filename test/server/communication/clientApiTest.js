'use strict';

let expect = require('chai').expect,
    WebSocket = require('ws'),
    WebSocketServer = require('ws').Server,
    ClientApi = require('../../../server/communication/clientApi'),
    GameType = require('../../../server/game/game').GameType,
    GameMode = require('../../../server/game/gameMode'),
    CardColor = require('../../../shared/deck/card').CardColor,
    TestDataCreator = require('../../testDataCreator');

let messages = require('../../../shared/messages/messages');

describe('Client API', () => {

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
        it('should add given client to clients array', () => {
            let client = 'client';

            clientApi.addClient(client);

            expect(clientApi.clients[0]).to.equal(client);
        });
    });

    describe('requestPlayerName', () => {
        it('should wait for choosePlayerName', (done) => {
            let choosePlayerName = messages.create(messages.MessageType.CHOOSE_PLAYER_NAME, 'Hans');

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestPlayerName(client).then((data) => {
                    expect(data.playerName).to.equal(choosePlayerName.data.playerName);
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client.send(JSON.stringify(choosePlayerName));
                }
            });
        });

        it('should reject invalid answer messages', (done) => {
            let clientAnswer = messages.create(messages.MessageType.PLAYED_CARDS, ['a', 'b', 'c']);

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestPlayerName(client).then(() => done(new Error('Should not resolve'))).catch((data) => {
                    expect(data).to.equal('Invalid client answer: ' + JSON.stringify(clientAnswer));
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client.send(JSON.stringify(clientAnswer));
                }
            });
        });

        it('should reject empty answer messages', (done) => {
            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestPlayerName(client).then(() => done(new Error('Should not resolve'))).catch((data) => {
                    expect(data).to.equal('Invalid client answer: ');
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
                    client.send(undefined);
                }
            });
        });
    });

    describe('dealCards', () => {
        it('should deal cards to given client', (done) => {
            let cards = ['a', 'b', 'c'];

            wss.on('connection', (client) => {
                clientApi.addClient(client);
                clientApi.dealCards(client, cards);
            });

            let client = new WebSocket('ws://localhost:10001');

            new Promise((resolve) => {
                client.on('message', (message) => {
                    message = JSON.parse(message);

                    expect(message.type).to.equal(messages.MessageType.DEAL_CARDS);
                    expect(message.data).to.eql(cards);

                    resolve();
                });
            }).then(() => done()).catch(done);
        });
    });

    describe('requestTrumpf', () => {
        it('should wait for chooseTrumpf', (done) => {
            let chooseTrumpf = messages.create(messages.MessageType.CHOOSE_TRUMPF, 'Spades');

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestTrumpf(client, false).then((data) => {
                    expect(data).to.equal(chooseTrumpf.data);
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_TRUMPF) {
                    client.send(JSON.stringify(chooseTrumpf));
                }
            });
        });
    });

    describe('broadcastStich', () => {
        it('should send the winner of the stich to all clients', (done) => {
            let clients,
                clientPromises = [],
                stichMessage = { name : 'hans' };

            //console.log(JSON.stringify(winner));
            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastStich(stichMessage);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(messages.MessageType.BROADCAST_STICH);
                        expect(message.data).to.eql(stichMessage);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });

    describe('broadcastPlayedCards', () => {
        it('should send played cards to all clients', (done) => {
            let clients,
                playedCards = ['a', 'b', 'c'],
                clientPromises = [];

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastCardPlayed(playedCards);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(messages.MessageType.PLAYED_CARDS);
                        expect(message.data).to.eql(playedCards);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });

    describe('broadcastTrumpf', () => {
        it('should send chosen Trumpf to all clients', (done) => {
            let clients,
                gameType = GameType.create(GameMode.TRUMPF, CardColor.SPADES),
                clientPromises = [];

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastTrumpf(gameType);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(messages.MessageType.BROADCAST_TRUMPF);
                        expect(message.data).to.eql(gameType);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });

    describe('requestCard', () => {
        it('should wait for chooseCard', (done) => {
            let chooseCard = messages.create(messages.MessageType.CHOOSE_CARD, 'c'),
                cardsOnTable = ['a', 'b'];

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestCard(client, cardsOnTable).then((data) => {
                    expect(data.card).to.equal(chooseCard.data.card);
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_CARD) {
                    client.send(JSON.stringify(chooseCard));
                }
            });
        });
    });

    describe('rejectCard', () => {
        it('should wait for chooseCard', (done) => {
            let chooseCard = messages.create(messages.MessageType.CHOOSE_CARD, 'a'),
                cardsOnTable = ['c', 'b'],
                card = 'e';

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.rejectCard(client, card, cardsOnTable).then((data) => {
                    expect(data.card).to.equal(chooseCard.data.card);
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REJECT_CARD) {
                    client.send(JSON.stringify(chooseCard));
                }
            });
        });
    });
});
