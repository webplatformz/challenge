'use strict';

let create = function create(team, name, clientApi) {
    return {
        team,
        name,
        clientApi,

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
