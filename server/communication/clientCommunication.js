'use strict';

import * as messages from '../../shared/messages/messages.js';
import {MessageType} from '../../shared/messages/messageType.js';
import validate from 'validate.js';
import {Logger} from './../logger.js';

const ClientCommunication = {
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

    on(client, messageType, messageHandler) {
        function handleMessage(message) {
            let messageObject = ClientCommunication.fromJSON(message);

            if (messageObject.type === messageType.name) {
                Logger.debug('<-- Received Message: ' + message);

                const validationResult = validate(messageObject, messageType.constraints);
                if (validationResult) {
                    ClientCommunication.send(client, MessageType.BAD_MESSAGE.name, validationResult);
                } else {
                    messageHandler(messageObject);
                }
            }
        }

        client.on('message', handleMessage);

        return () => client.removeListener('message', handleMessage);
    },

    await(client, expectedMessageType) {
        return new Promise((resolve, reject) => {
            client.on('message', function handleMessage(message) {
                let messageObject = ClientCommunication.fromJSON(message);

                if (messageObject.type === expectedMessageType.name) {
                    Logger.debug('<-- Received Message: ' + message);

                    const validationResult = validate(messageObject, expectedMessageType.constraints);
                    if (validationResult) {
                        ClientCommunication.send(client, MessageType.BAD_MESSAGE.name, validationResult);
                        reject(validationResult);
                    } else {
                        resolve(messageObject);
                    }
                    client.removeListener('message', handleMessage);
                }
            });
        });
    },

    send(client, messageType, ...data) {
        if (client.readyState === 1) {
            var messageToSend = this.toJSON(messages.create(messageType, ...data));
            Logger.debug('<-- Send Message: ' + messageToSend);
            client.send(messageToSend);
        }
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

export default ClientCommunication;