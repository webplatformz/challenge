'use strict';

let expect = require('chai').expect,
    WebSocket = require('ws'),
    WebSocketServer = require('ws').Server,
    SimpleBot = require('./SimpleBot'),
    JassSession = require('../../../server/game/session');





describe('Integration test', () => {

    let wss;

    beforeEach(() => {
        wss = new WebSocketServer({port: 10001});
    });

    afterEach(() => {
        wss.close();
    });

    describe('Play a complete game', () => {
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

            let emptyFunction = () => {};
            SimpleBot.create("Client 1", done);
            SimpleBot.create("Client 2", emptyFunction);
            SimpleBot.create("Client 3", emptyFunction);
            SimpleBot.create("Client 4", emptyFunction);
        });
    });

});
