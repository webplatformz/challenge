

import {SessionType} from '../../shared/session/sessionType';
import * as SingleGameSession from './singleGameSession';
import * as TournamentSession from './tournamentSession';

export function create(sessionName, sessionType = SessionType.SINGLE_GAME) {
    switch (sessionType) {
        case SessionType.SINGLE_GAME:
            return SingleGameSession.create(sessionName);
        case SessionType.TOURNAMENT:
            return TournamentSession.create(sessionName);
    }
}