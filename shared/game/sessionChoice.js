'use strict';

const SessionChoice = {
    AUTOJOIN: 'AUTOJOIN',
    CREATE_NEW: 'CREATE_NEW',
    JOIN_EXISTING: 'JOIN_EXISTING',
    SPECTATOR: 'SPECTATOR'
};

Object.freeze(SessionChoice);

module.exports = SessionChoice;