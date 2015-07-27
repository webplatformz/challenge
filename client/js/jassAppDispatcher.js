'use strict';

let Dispatcher = require('flux').Dispatcher;

let JassAppDispatcher = new Dispatcher();

JassAppDispatcher.handleViewAction = function(action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
};

JassAppDispatcher.handleServerAction = function(action) {
    this.dispatch({
        source: 'SERVER_ACTION',
        action: action
    });
};

module.exports = JassAppDispatcher;