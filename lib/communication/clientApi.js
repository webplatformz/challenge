'use strict';

var ClientApi = {

    setClients : function setClients(clients) {
        this.clients = clients;
    },

    requestTrump : function requestTrump(clientId, pushed) {
        var client = this.clients[clientId];

        return new Promise(function(resolve) {
            client.on('chooseTrump', function handleChooseTrump(data) {
                client.removeListener('chooseTrump', handleChooseTrump);
                resolve(data);
            });

            client.emit('requestTrump', {pushed: pushed});
        });
    }
};


module.exports = ClientApi;
