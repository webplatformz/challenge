'use strict';

import http from 'http';
import {Server as WebSocketServer} from 'ws';
import SessionHandler from './session/sessionHandler';

let server;

export function start(port, app) {
    server = http.createServer(app);

    new WebSocketServer({server}).on('connection', (ws) => {
        SessionHandler.handleClientConnection(ws);
    });

    server.listen(port, () => {
        console.info('Server listening on port:', server.address().port);
    });
}

export function stop() {
    SessionHandler.resetInstance();
    server.close();
}