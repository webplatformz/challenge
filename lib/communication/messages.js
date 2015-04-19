'use strict';

let MessageType = {
    REQUEST_TRUMP: 'REQUEST_TRUMP',
    CHOOSE_TRUMP: 'CHOOSE_TRUMP'
};

function createRequestTrump (pushed) {
    return {
        type: MessageType.REQUEST_TRUMP,
        data: {
            pushed: pushed
        }
    };
}

function createChooseTrump (color) {
    return {
        type: MessageType.CHOOSE_TRUMP,
        data: {
            color: color
        }
    };
}

function create() {
    let parameters = Array.prototype.slice.apply(arguments);

    switch (parameters.shift()) {
        case MessageType.REQUEST_TRUMP:
            return createRequestTrump.apply(undefined, parameters);
        case MessageType.CHOOSE_TRUMP:
            return createChooseTrump.apply(undefined, parameters);
    }
}

module.exports = {
    MessageType: MessageType,

    create: create
};