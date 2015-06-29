'use strict';

let create = function create(webSocket, team) {
    return {
        webSocket,
        team
    };
};

module.exports = {
    create
};
