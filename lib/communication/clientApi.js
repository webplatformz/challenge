'use strict';

require('ws');

var ClientApi = {
    init : function init(clients) {
        this.clients = clients;
    },

    setTrump : function setTrump(trump) {
        this.trump = trump;
    },
    /**
     * @param clientId {String}
     * @return promise
     */
    requestTrump : function requestTrump(clientId) {
        // return promise
    }
};


module.exports = ClientApi;