'use strict';

import express from 'express';
import http from 'http';
import {Server} from 'ws';

const port = process.env.PORT || 3000;

let app = express();
let httpServer = http.createServer(app);
let webSocketServer = new Server({
    server: httpServer
});

let sessionHandler = require('./server/session/sessionHandler');

app.use(express.static(__dirname + '/client'));

webSocketServer.on('connection', (ws) => {
    sessionHandler.handleClientConnection(ws);
});

httpServer.listen(port, () => {
    console.info('Server listening on port:', httpServer.address().port);
});

module.exports = {
    close: function () {
        sessionHandler.resetInstance();
        httpServer.close();
    }
};