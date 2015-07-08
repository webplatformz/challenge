'use strict';

let messages = require('../../shared/messages/messages');
let Logger = require('./logger');

function toJSON(object) {
    return JSON.stringify(object);
}

function fromJSON(jsonAsString) {
    try {
        return JSON.parse(jsonAsString);
    } catch (error) {
        Logger.error("Bad message from client: " + jsonAsString);
    }
}

function send(client, messageType, ...data) {
    var messageToSend = toJSON(messages.create(messageType, ...data));
    Logger.debug('<-- Send Message: ' + messageToSend);
    client.send(messageToSend);
}

function broadcast(clients, messageType, ...data) {
    Logger.debug('<-- Start Broadcast: ');
    clients.forEach((client) => {
        send(client, messageType, ...data);
    });
    Logger.debug('End Broadcast -->');

}

function request(client, messageType, onMessage, ...data) {
    var messageToSend = messages.create(messageType, ...data);
    Logger.debug('<-- Send Message: ' + messageToSend);
    client.send(toJSON(messageToSend));

    return new Promise((resolve, reject) => {
        client.on('message', function handleMessage(message) {
            Logger.debug('<-- Received Message: ' + message);
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