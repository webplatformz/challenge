'use strict';

var io = require('socket.io')();

var message = require("./lib/communication/message");
var JassSession = require('./lib/game/session');

var ClientApi = require('./lib/communication/clientApi');

var clients = [];

io.on('connection', function connection(ws) {
    clients.push(ws);

    if (clients.length === 4) {
        var jassSession = Object.create(JassSession);
        var clientApi = Object.create(ClientApi);

        clientApi.init(clients);
        jassSession.setClientApi(clientApi);

        clients = [];
    }
});

io.listen(3000);
console.log('server started and listening on port 3000');
