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
            SimpleBot.create(1, "Client 1", done);
            setTimeout(SimpleBot.create.bind(null, 2, "Client 2", emptyFunction), 10);
            setTimeout(SimpleBot.create.bind(null, 3, "Client 3", emptyFunction), 10);
            setTimeout(SimpleBot.create.bind(null, 4, "Client 4", emptyFunction), 10);
        });
    });

});
