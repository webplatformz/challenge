'use strict';

var MessageType = {
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


module.exports = {
    MessageType: MessageType,

    createRequestTrump: createRequestTrump,
    createChooseTrump: createChooseTrump
};