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

let ClientApi = {
    requestTrump : function requestTrump(clientId, pushed) {
        let client = this.clients[clientId];

        client.send(toJSON(messages.create(messages.MessageType.REQUEST_TRUMP, pushed)));

        return new Promise((resolve) => {
            client.on('message', function handleChooseTrump(message) {
                message = fromJSON(message);

                if (message.type === messages.MessageType.CHOOSE_TRUMP) {
                    client.removeListener('message', handleChooseTrump);
                    resolve(message.data);
                }
            });
        });
    },

    broadcastCardPlayed : function broadcastCardPlayed(playedCard) {
        // TODO
    }
};

let create = function create(clients) {
    let clientApi = Object.create(ClientApi);
    clientApi.clients = clients;
    return clientApi;
};


module.exports = {
    create
};
