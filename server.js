'use strict';

let port = process.env.PORT || 3000;

let express = require('express');
let app = express();
let server = require('http').createServer(app);
let WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({server: server});
let JassSession = require('./server/game/session');

let session = JassSession.create();

app.use(express.static(__dirname + '/client'));

wss.on('connection', (ws) => {
    session.addPlayer(ws);

    if (session.isComplete()) {
        session.start().then((team) => {
            console.log("Team " + team.name + " won ");
        });

        session = JassSession.create();
    }
});

server.listen(port, () => {
    console.info('Server listening on port:', server.address().port);
});