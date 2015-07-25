'use strict';

let Game = {

};

module.exports = {
    create: () => {
        let game = Object.create(Game);
        return game;
    }
}