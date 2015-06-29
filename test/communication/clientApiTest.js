"use strict";

let expect = require('chai').expect;
let WebSocket = require('ws');
let WebSocketServer = require('ws').Server;
let ClientApi = require('../../lib/communication/clientApi');
let messages = require('../../lib/communication/messages');

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

    describe('requestTrumpf', () => {
        it('should wait for chooseTrumpf', (done) => {
            let chooseTrump = messages.create(messages.MessageType.CHOOSE_TRUMPF, 'Spades');

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestTrumpf(client, false).then((data) => {
                    expect(data.color).to.equal(chooseTrump.data.color);
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === messages.MessageType.REQUEST_TRUMPF) {
                    client.send(JSON.stringify(chooseTrump));
                }
            });
        });
    });

    describe('broadcastPlayedCards', () => {
        it('should send played cards to all clients', (done) => {
            let clients,
                cardsPlayed = ['a', 'b', 'c'],
                clientPromises = [];

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastCardPlayed(cardsPlayed);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(messages.MessageType.CARDS_PLAYED);
                        expect(message.data.cardsPlayed).to.eql(cardsPlayed);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });
});
