'use strict';

let EventEmitter = require('events').EventEmitter,
    JassAppDispatcher = require('./jassAppDispatcher'),
    JassAppConstants = require('./jassAppConstants');

let JassAppStore = Object.create(EventEmitter.prototype);

JassAppStore.state = {
    error: undefined
};

JassAppStore.emitChange = function() {
    this.emit('change');
};

JassAppStore.addChangeListener = function(callback) {
    this.on('change', callback);
};

JassAppStore.removeChangeListener = function(callback) {
    this.removeListener('change', callback);
};

JassAppDispatcher.register(function (payload){
    let action = payload.action;

    switch(action.actionType) {
        case JassAppConstants.ERROR:
            JassAppStore.state.error = action.data;
            JassAppStore.emitChange();
            break;
    }
});

module.exports = JassAppStore;