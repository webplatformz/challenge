import fs from 'fs';
import {MessageType} from '../../shared/messages/messageType';
import {Logger} from '../logger';

const methodsToIntercept = ['send', 'request', 'broadcast'];
const getReceivedMessageType = serverMessageType => {
    if (serverMessageType === MessageType.REQUEST_TRUMPF.name) {
        return MessageType.CHOOSE_TRUMPF.name;
    }
    return MessageType.CHOOSE_CARD.name;
};

const JsonResultProxy = {

    destroy() {
        this.fileWriter.write(']', () => this.fileWriter.close());
    },

    writeResult(resultToWrite) {
        let resultString = JSON.stringify(resultToWrite);

        if (this.hasResults) {
            resultString = ',' + resultString;
        } else {
            this.hasResults = true;
        }

        this.fileWriter.write(resultString);
    },

    get(target, propKey) {
        return (...args) => {
            const result = target[propKey].apply(target, args);

            if (methodsToIntercept.includes(propKey)) {
                const clientId = args.shift().jassChallengeId;

                const serverSendResult = {
                    broadcast: !clientId,
                    sentTo: clientId,
                    messageType: args.shift(),
                    data: args.pop()
                };

                this.writeResult(serverSendResult);

                if (result && typeof result.then === 'function') {
                    result.then((clientResponse) => {
                        this.writeResult({
                            broadcast: false,
                            receivedFrom: clientId,
                            messageType: getReceivedMessageType(serverSendResult.messageType),
                            data: clientResponse
                        });
                        return clientResponse;
                    });
                }
            }

            return result;
        };
    }
};

export function create(fileName) {
    const obj = Object.create(JsonResultProxy);
    obj.hasResults = false;
    obj.fileWriter = new fs.WriteStream(fileName + '.json');
    obj.fileWriter.write('[');
    obj.fileWriter.on('error', Logger.error);
    return obj;
}