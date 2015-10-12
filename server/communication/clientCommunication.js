'use strict';

import messages from '../../shared/messages/messages.js';
import MessageType from '../../shared/messages/messageType.js';
import validate from 'validate.js';
import Logger from './logger.js';

export default {
    toJSON(object) {
        return JSON.stringify(object);
    },

    fromJSON(jsonAsString) {
        try {
            return JSON.parse(jsonAsString);
        } catch (error) {
            Logger.error("Bad message from client: " + jsonAsString);
        }
    },

    await(client, expectedMessageType) {
        return new Promise((resolve, reject) => {
            client.on('message', (message) => {
                let messageObject = this.fromJSON(message);

                if (messageObject.type === expectedMessageType.name) {
                    let validationResult = validate(messageObject, expectedMessageType.constraints);

                    if (validationResult) {
                        console.log(validationResult);
                        this.send(client, MessageType.BAD_MESSAGE.name, validationResult);
                        reject(validationResult);
                    } else {
                        resolve(messageObject);
                    }
                }
            });
        });
    },

    send(client, messageType, ...data) {
        var messageToSend = this.toJSON(messages.create(messageType, ...data));
        Logger.debug('<-- Send Message: ' + messageToSend);
        client.send(messageToSend);
    },

    broadcast(clients, messageType, ...data) {
        Logger.debug('<-- Start Broadcast: ');
        clients.forEach((client) => {
            this.send(client, messageType, ...data);
        });
        Logger.debug('End Broadcast -->');
    },

    request(client, messageType, onMessage, ...data) {
        var messageToSend = this.toJSON(messages.create(messageType, ...data));
        client.send(messageToSend);
        Logger.debug('<-- Send Message: ' + messageToSend);

        return new Promise((resolve, reject) => {
            client.on('message', function handleMessage(message) {
                Logger.debug('<-- Received Message: ' + message);
                client.removeListener('message', handleMessage);
                onMessage(message, resolve, reject);
            });
        });
    }
};