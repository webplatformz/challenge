'use strict';

import express from 'express';
import http from 'http';
import {Server as WebSocketServer} from 'ws';
import SessionHandler from './session/sessionHandler';

let server;

export default {
    start(port, app) {
        server = http.createServer(app);

        new WebSocketServer({server}).on('connection', (ws) => {
            SessionHandler.handleClientConnection(ws);
        });

        server.listen(port, () => {
            console.info('Server listening on port:', server.address().port);
        });
    },

    stop() {
        SessionHandler.resetInstance();
        server.close();
    }
};
