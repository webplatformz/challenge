'use strict';

let port = process.env.PORT || 3000;

let app = require('express')();
let server = require('http').createServer(app);
let WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({ server : server});
let JassSession = require('./lib/game/session');

let session = JassSession.create();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/websocketGUI.html');
});

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