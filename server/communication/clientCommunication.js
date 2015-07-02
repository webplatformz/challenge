'use strict';

let messages = require('../../shared/messages/messages');

function toJSON(object) {
    return JSON.stringify(object);
}

function fromJSON(jsonAsString) {
    try {
        return JSON.parse(jsonAsString);
    } catch (error) {
        console.error("Bad message from client");
    }
}

function send(client, messageType, ...data) {
    client.send(toJSON(messages.create(messageType, ...data)));
}

function broadcast(clients, messageType, ...data) {
    clients.forEach((client) => {
        send(client, messageType, ...data);
    });
}

function request(client, messageType, onMessage, ...data) {
    client.send(toJSON(messages.create(messageType, ...data)));

    return new Promise((resolve, reject) => {
        client.on('message', function handleMessage(message) {
            client.removeListener('message', handleMessage);
            onMessage(message, resolve, reject);
        });
    });
}

module.exports = {
    toJSON,
    fromJSON,
    send,
    broadcast,
    request
};