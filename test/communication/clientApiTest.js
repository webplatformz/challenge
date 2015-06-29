"use strict";

let assert = require('assert');
let WebSocket = require('ws');
let WebSocketServer = require('ws').Server;
let ClientApi = require('../../lib/communication/clientApi');
let messages = require('../../lib/communication/messages');

describe('Client API', () => {

    let wss;

    beforeEach(() => {
        wss = new WebSocketServer({port: 10001});
    });

    afterEach(() => {
        wss.close();
    });

    it('should wait for chooseTrump on requestTrump', (done) => {
        let chooseTrump = messages.create(messages.MessageType.CHOOSE_TRUMP, 'Spades');

        wss.on('connection', (client) => {
            let clientApi = ClientApi.create([client]);

            clientApi.requestTrump(0, false).then((data) => {
                assert.equal(data.color, chooseTrump.data.color);
                done();
            }).catch(done);
        });

        let client = new WebSocket('ws://localhost:10001');

        client.on('message', (message) => {
            message = JSON.parse(message);

            if (message.type === messages.MessageType.REQUEST_TRUMP) {
                client.send(JSON.stringify(chooseTrump));
            }
        });
    });
});
