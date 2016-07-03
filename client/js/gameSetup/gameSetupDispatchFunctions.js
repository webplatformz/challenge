import {SessionType} from '../../../shared/session/sessionType';
import JassAppConstants from '../jassAppConstants';

const GameSetupDispatchFunctions = {
    createNewSession(sessionType, sessionName, asSpectator) {
        if (sessionType === SessionType.TOURNAMENT) {
            this.dispatch({
                type: JassAppConstants.CREATE_NEW_SESSION,
                data: {
                    sessionName,
                    sessionType,
                    asSpectator
                }
            });
        } else {
            this.dispatch({
                type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
                data: {
                    sessionName,
                    joinSession: (chosenTeamIndex) => {
                        this.dispatch({
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
        this.dispatch({type: JassAppConstants.AUTOJOIN_SESSION});
    },
    joinExistingSession(sessionName) {
        this.dispatch({
            type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
            data: {
                sessionName,
                joinSession: (chosenTeamIndex) => {
                    this.dispatch({
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
        this.dispatch({
            type: JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR,
            data: sessionName
        });
    }
};

export function create(dispatch) {
    let gameSetupDispatchFunctions = Object.create(GameSetupDispatchFunctions);
    gameSetupDispatchFunctions.dispatch = dispatch;
    return gameSetupDispatchFunctions;
}