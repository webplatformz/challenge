'use strict';

var port = process.env.PORT || 3000;

var app = require('express')();
var server = require('http').createServer(app);
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server : server});
var JassSession = require('./lib/game/session');
var ClientApi = require('./lib/communication/clientApi');
var clients = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/websocketGUI.html');
});

wss.on('connection', function connection(ws) {
    clients.push(ws);

    if (clients.length === 4) {
        var jassSession = Object.create(JassSession).init();
        var clientApi = Object.create(ClientApi);

        clientApi.setClients(clients);
        jassSession.setClientApi(clientApi);

        clients = [];
    }
});

server.listen(port, function () {
    console.info('Server listening on port:', server.address().port);
});