"use strict";

var assert = require('assert');
var io = require('socket.io');
var ioclient = require('socket.io-client');
var ClientApi = require('../../lib/communication/clientApi');

// more help on async code http://lostechies.com/derickbailey/2012/08/17/asynchronous-unit-tests-with-mocha-promises-and-winjs/
describe('Client API', function() {


    beforeEach(function() {
        io = io.listen(10001);
    });

    afterEach(function() {
        io.close();
    });

    it('should wait for chooseTrump on requestTrump', function(done){
        var chooseTrump = {color: 'Spades'};

        io.on('connection', function connection(ws) {
            var clientApi = Object.create(ClientApi);
            clientApi.init([ws]);

                clientApi.requestTrump(0, false).then(function(data) {
                    assert.equal(data.color, chooseTrump.color);
                    done();
                }).catch(done);
        });

        var client = ioclient.connect('ws://localhost:10001');

        client.on('requestTrump', function() {
            client.emit('chooseTrump', chooseTrump);
        });
    });
});
