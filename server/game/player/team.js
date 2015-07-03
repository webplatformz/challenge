'use strict';

let create = function create(name) {
    return {
        name,
        points : 0,
        currentRoundPoints : 0
    };
};

module.exports = {
    create
};