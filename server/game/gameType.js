'use strict';

let create = function create(gameMode, cardColor) {
    return {
        mode: gameMode,
        trumpfColor: cardColor
    };
};

module.exports = {
    create
};