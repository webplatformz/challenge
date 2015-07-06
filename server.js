'use strict';

let port = process.env.PORT || 3000;

let express = require('express');
let app = express();
let server = require('http').createServer(app);
let WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({
    server
});

let sessionHandler = require('./server/game/sessionHandler');

app.use(express.static(__dirname + '/client'));

wss.on('connection', (ws) => {
    sessionHandler.handleClientConnection(ws);
});

server.listen(port, () => {
    console.info('Server listening on port:', server.address().port);
});

module.exports = {
    close: function () {
        sessionHandler.resetInstance();
        server.close();
    }
};