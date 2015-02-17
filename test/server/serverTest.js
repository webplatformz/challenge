"use strict";

var assert = require("assert"); // node.js core module
var webSocket = require('ws');


// more help on async code http://lostechies.com/derickbailey/2012/08/17/asynchronous-unit-tests-with-mocha-promises-and-winjs/

// TODO Server shoukd be started by grunt test task - test should not be relying on running server
describe('Integration tests', function(){
    describe('Player joining', function(){
        it('should ask for a player name, on connection establish', function(done){
            var client = new webSocket('ws://localhost:10000');

            client.on('message', function(data, flags) {
                done();
                assert.equal(data, "{\"type\":\"REQUEST_NAME\"}");
            });

        });

        it('should ask for a player name for the second client too', function(done){
            var client = new webSocket('ws://localhost:10000');

            client.on('message', function(data, flags) {
                done();
                assert.equal(data, "{\"type\":\"REQUEST_NAME\"}");
            });

        });

        //it('should send a game started message, because all players have joined', function(done){
        //    client.on('message', function(data, flags) {
        //        done();
        //        assert.equal(data, "{\"type\":\"GAME_STARTED\"}");
        //    });
        //
        //});
    });
});
