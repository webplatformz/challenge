'use strict';

let create = function create(webSocket, team, id, name) {
    return {
        webSocket,
        team,
        id,
        name
    };
};

module.exports = {
    create
};
