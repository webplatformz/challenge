'use strict';

let keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
    ERROR: null,
    BAD_MESSAGE: null,
    REQUEST_PLAYER_NAME: null,
    CHOOSE_PLAYER_NAME: null,
    REQUEST_SESSION_CHOICE: null,
    CHOOSE_EXISTING_SESSION: null,
    CHOOSE_EXISTING_SESSION_SPECTATOR: null,
    CREATE_NEW_SESSION: null,
    AUTOJOIN_SESSION: null,
    SESSION_JOINED: null,
    BROADCAST_TEAMS: null,
    PLAYED_CARDS: null,
    DEAL_CARDS: null,
    REQUEST_TRUMPF: null,
    CHOOSE_TRUMPF: null,
    BROADCAST_TRUMPF: null
});