"use strict";

var assert = require('assert');
var WebSocket = require('ws');
var WebSocketServer = require('ws').Server;
var ClientApi = require('../../lib/communication/clientApi');
var messages = require('../../lib/communication/messages');

describe('Client API', function() {

    var wss;

    beforeEach(function() {
        wss = new WebSocketServer({port: 10001});
    });

    afterEach(function() {
        wss.close();
    });

    it('should wait for chooseTrump on requestTrump', function(done) {
        var chooseTrump = messages.create(messages.MessageType.CHOOSE_TRUMP, 'Spades');

        wss.on('connection', function connection(client) {
            var clientApi = Object.create(ClientApi);
            clientApi.setClients([client]);

            clientApi.requestTrump(0, false).then(function(data) {
                assert.equal(data.color, chooseTrump.data.color);
                done();
            }).catch(done);
        });

        var client = new WebSocket('ws://localhost:10001');

        client.on('message', function(message) {
            message = JSON.parse(message);

            if (message.type === messages.MessageType.REQUEST_TRUMP) {
                client.send(JSON.stringify(chooseTrump));
            }
        });
    });
});
