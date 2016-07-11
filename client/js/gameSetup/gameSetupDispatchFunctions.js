import {SessionType} from '../../../shared/session/sessionType';
import JassAppConstants from '../jassAppConstants';

export default function(dispatch) {
    return {
        choosePlayerName(playerName) {
            dispatch({
                type: JassAppConstants.CHOOSE_PLAYER_NAME,
                data: playerName
            })
        },
        createNewSession(sessionType, sessionName, asSpectator) {
            if (sessionType === SessionType.TOURNAMENT) {
                dispatch({
                    type: JassAppConstants.CREATE_NEW_SESSION,
                    data: {
                        sessionName,
                        sessionType,
                        asSpectator
                    }
                });
            } else {
                dispatch({
                    type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
                    data: {
                        sessionName,
                        joinSession: (chosenTeamIndex) => {
                            dispatch({
                                type: JassAppConstants.CREATE_NEW_SESSION,
                                data: {
                                    sessionName,
                                    sessionType,
                                    asSpectator,
                                    chosenTeamIndex
                                }
                            });
                        }
                    }
                });
            }
        },
        autojoinSession() {
            dispatch({type: JassAppConstants.AUTOJOIN_SESSION});
        },
        joinExistingSession(sessionName) {
            dispatch({
                type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
                data: {
                    sessionName,
                    joinSession: (chosenTeamIndex) => {
                        dispatch({
                            type: JassAppConstants.CHOOSE_EXISTING_SESSION,
                            data: {
                                sessionName,
                                chosenTeamIndex
                            }
                        });
                    }
                }
            });
        },
        joinExistingSessionSpectator(sessionName) {
            dispatch({
                type: JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR,
                data: sessionName
            });
        }
    };
}