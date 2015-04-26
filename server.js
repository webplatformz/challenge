'use strict';

let port = process.env.PORT || 3000;

let app = require('express')();
let server = require('http').createServer(app);
let WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({ server : server});
let JassSession = require('./lib/game/session');
let ClientApi = require('./lib/communication/clientApi');
let clients = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/websocketGUI.html');
});

wss.on('connection', (ws) => {
    clients.push(ws);

    if (clients.length === 4) {
        let jassSession = Object.create(JassSession).init();
        let clientApi = Object.create(ClientApi);

        clientApi.setClients(clients);
        jassSession.setClientApi(clientApi);

        clients = [];
    }
});

server.listen(port, () => {
    console.info('Server listening on port:', server.address().port);
});