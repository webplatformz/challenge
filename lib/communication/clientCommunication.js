'use strict';

let messages = require('./messages');

function toJSON(object) {
    return JSON.stringify(object);
}

function fromJSON(string) {
    try {
        return JSON.parse(string);
    } catch (error) {
        console.error("Bad message from client");
    }
}

function broadcast(clients, messageType, ...data) {
    clients.forEach((client) => {
        client.send(toJSON(messages.create(messageType, ...data)));
    });
}

function request(client, messageType, onMessage, ...data) {
    client.send(toJSON(messages.create(messageType, ...data)));

    return new Promise((resolve, reject) => {
        client.on('message', (message) => {
            onMessage(message, resolve, reject);
        });
    });
}

module.exports = {
    toJSON,
    fromJSON,
    broadcast,
    request
};