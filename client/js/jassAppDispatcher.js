

import { Dispatcher } from 'flux';

const Source = {
    VIEW_ACTION: 'VIEW_ACTION',
    SERVER_ACTION: 'SERVER_ACTION'
};

const JassAppDispatcher = Object.assign(new Dispatcher(), {
    Source,

    handleViewAction(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action
        });
    },

    handleServerAction(action) {
        this.dispatch({
            source: 'SERVER_ACTION',
            action
        });
    },

    throwErrorAction(action) {
        this.dispatch({
            source: action.source,
            action
        });
    }
});

export default JassAppDispatcher;
