'use strict';

let create = function create(webSocket, team, id, name) {
    return {
        webSocket,
        team,
        id,
        name,

        rejectCard : function rejectCard() {
            // TODO
        },

        requestCard : function requestCard() {
            // TODO return card
        }
    };
};

module.exports = {
    create
};
