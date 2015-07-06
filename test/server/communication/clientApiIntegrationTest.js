'use strict';

process.env.PORT = 10001;

let expect = require('chai').expect,
    WebSocket = require('ws'),
    WebSocketServer = require('ws').Server,
    SimpleBot = require('./SimpleBot');


describe('Integration test', () => {

    let server;

    beforeEach(() => {
        server = require('../../../server');
    });

    afterEach(() => {
        server.close();
    });

    describe('Play a complete game', () => {
        it('should start the game after 4 players have been connected', (done) => {
            let emptyFunction = () => {};
            SimpleBot.create("Client 1", done);
            SimpleBot.create("Client 2", emptyFunction);
            SimpleBot.create("Client 3", emptyFunction);
            SimpleBot.create("Client 4", emptyFunction);
        });
    });

});
