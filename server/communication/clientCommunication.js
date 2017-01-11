import * as messages from '../../shared/messages/messages';
import {MessageType} from '../../shared/messages/messageType';
import validate from 'validate.js';
import {Logger} from './../logger';

const ClientCommunication = {
    toJSON(object) {
        return JSON.stringify(object);
    },

    fromJSON(jsonAsString) {
        try {
            return JSON.parse(jsonAsString);
        } catch (error) {
            Logger.error('Bad message from client: ' + jsonAsString);
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
            let messageToSend = this.toJSON(messages.create(messageType, ...data));
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

    request(client, messageType, expectedMessageType, timeoutInMilliseconds, ...data) {
        let messageToSend = this.toJSON(messages.create(messageType, ...data));
        client.send(messageToSend);
        Logger.debug('<-- Send Message: ' + messageToSend);

        return new Promise((resolve, reject) => {
            let requestTimeout;

            function handleMessage(message) {
                clearTimeout(requestTimeout);
                Logger.debug('<-- Received Message: ' + message);
                client.removeListener('message', handleMessage);
                resolveCorrectMessageOrReject(client, expectedMessageType, message, resolve, reject);
            }

            if(timeoutInMilliseconds !== 0) {
                requestTimeout = setTimeout(() => {
                    Logger.debug('Message not yet received, rejecting promise.');
                    client.removeListener('message', handleMessage);
                    reject(`Request timeout of ${timeoutInMilliseconds} ms exceeded`);
                }, timeoutInMilliseconds);
            }

            client.on('message', handleMessage);
        });
    }
};

function resolveCorrectMessageOrReject(client, expectedMessageType, message, resolve, reject) {
    let messageObject = ClientCommunication.fromJSON(message);

    if (messageObject && messageObject.type === expectedMessageType.name) {
        let validationErrorResult = validate(messageObject, expectedMessageType.constraints);

        if (validationErrorResult) {
            ClientCommunication.send(client, MessageType.BAD_MESSAGE.name, validationErrorResult);
            reject(validationErrorResult);
        }

        let cleanedMessageObject = validate.cleanAttributes(messageObject, expectedMessageType.constraints);
        resolve(cleanedMessageObject.data);
    } else {
        ClientCommunication.send(client, MessageType.BAD_MESSAGE.name, message);
        reject('Invalid Message: ' + message + ', expected message with type: ' + expectedMessageType.name);
    }
}

export default ClientCommunication;
