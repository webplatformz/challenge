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
        },

        requestTrumpf : function (isGeschoben) {
            this.clientApi.requestTrumpf(isGeschoben);
        }
    };
};

module.exports = {
    create
};
