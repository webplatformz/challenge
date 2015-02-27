'use strict';

var httpPort = 3000;
var websocketPort = 3001;

var app = require('express')();
var server = require('http').createServer(app);
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: websocketPort});
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

server.listen(httpPort, function () {
    console.info('Server listening on port:', server.address().port);
});