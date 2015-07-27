'use strict';

let EventEmitter = require('events').EventEmitter;

let GameSetupStore = Object.create(EventEmitter.prototype);

module.exports = GameSetupStore;