'use strict';

import {Dispatcher} from 'flux';

let JassAppDispatcher = Object.assign(new Dispatcher(), {
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