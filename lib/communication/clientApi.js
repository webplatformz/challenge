'use strict';

var REQUEST_TIMEOUT = 3000;

var ClientApi = {
    init : function init(clients) {
        this.clients = clients;
    },

    requestTrump : function requestTrump(clientId, pushed) {
        var client = this.clients[clientId];

        return new Promise(function then(resolve, reject) {
            var trumpChosen = false;

            client.on('chooseTrump', function(data) {
                trumpChosen = true;
                client.removeListener('chooseTrump', then);
                resolve(data);
            });

            client.emit('requestTrump', {pushed: pushed});

            setTimeout(function() {
                if (!trumpChosen) {
                    reject();
                }
            }, REQUEST_TIMEOUT);
        });
    }
};


module.exports = ClientApi;