"use strict";

// https://github.com/websockets/ws
var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({ port: 10000 });

var requestName = {
  type: "REQUEST_NAME"
};

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send(JSON.stringify(requestName));
});


// other events are
// close, error