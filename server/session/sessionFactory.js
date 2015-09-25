'use strict';

import SessionType from '../../shared/session/sessionType.js';
import SingleGameSession from './singleGameSession.js';
import TournamentSession from './tournamentSession.js';

module.exports = {
    create(sessionName, sessionType = SessionType.SINGLE_GAME) {
        switch(sessionType) {
            case SessionType.SINGLE_GAME:
                return SingleGameSession.create(sessionName);
            case SessionType.TOURNAMENT:
                return TournamentSession.create(sessionName);
        }
    }
};