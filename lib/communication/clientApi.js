'use strict';

function fromJSON(object) {
    return JSON.stringify(object);
}

function toJSON(string) {
    return JSON.parse(string);
}

function handleMessages(message) {
    // TODO match various api messages
}

var ClientApi = {

    setClients : function setClients(clients) {
        this.clients = clients;

        clients.forEach(function(client) {
            client.on('message', handleMessages);
        });
    },

    requestTrump : function requestTrump(clientId, pushed) {
        var client = this.clients[clientId];

        client.send(fromJSON({
            name: 'requestTrump',
            data: {
                pushed: pushed
            }
        }));

        return new Promise(function(resolve) {


            client.on('message', function handleChooseTrump(message) {
                message = toJSON(message);
                if (message.name === 'chooseTrump') {
                    client.removeAllListeners('handleChooseTrump');
                    resolve(message.data);
                }
            });
        });
    }
};


module.exports = ClientApi;
