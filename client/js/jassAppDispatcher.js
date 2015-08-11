'use strict';

import {Dispatcher} from 'flux';

const SOURCE = {
    VIEW_ACTION: 'VIEW_ACTION',
    SERVER_ACTION: 'SERVER_ACTION'
};

let JassAppDispatcher = Object.assign(new Dispatcher(), {
    SOURCE,

    handleViewAction: function (action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    },

    handleServerAction: function (action) {
        this.dispatch({
            source: 'SERVER_ACTION',
            action: action
        });
    },

    throwErrorAction: function (action) {
        this.dispatch({
            source: action.source,
            action: action
        });
    }
});

module.exports = JassAppDispatcher;