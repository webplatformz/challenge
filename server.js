'use strict';

var io = require('socket.io')();

var message = require("./lib/communication/message");
var JassSession = require('./lib/game/session');

var ClientApi = require('./lib/communication/clientApi');

var clients = [];
var port = 3000;

io.on('connection', function connection(ws) {
    clients.push(ws);

    if (clients.length === 4) {
        var jassSession = Object.create(JassSession).init();
        var clientApi = Object.create(ClientApi).init(clients);

        //clientApi.init(clients);
        jassSession.setClientApi(clientApi);

        clients = [];
    }
});

io.listen(port);
console.log('server started and listening on port ' + port);
