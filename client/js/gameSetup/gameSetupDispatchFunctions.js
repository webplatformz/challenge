import {SessionType} from '../../../shared/session/sessionType';
import JassAppConstants from '../jassAppConstants';
import ServerApi from '../communication/serverApi';

export default function(dispatch) {
    return {
        createNewSession(sessionType, sessionName, asSpectator) {
            if (sessionType === SessionType.TOURNAMENT) {
                ServerApi.sendCreateNewSessionMessage(sessionName, sessionType, asSpectator);
            } else {
                dispatch({
                    type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
                    data: {
                        sessionName,
                        joinSession: (chosenTeamIndex) => ServerApi.sendCreateNewSessionMessage(sessionName, sessionType, asSpectator, chosenTeamIndex)
                    }
                });
            }
        },
        autojoinSession() {
            ServerApi.sendAutojoinSessionMessage();
        },
        joinExistingSession(sessionName) {
            dispatch({
                type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
                data: {
                    sessionName,
                    joinSession: (chosenTeamIndex) => ServerApi.sendChooseExistingSessionMessage(sessionName, chosenTeamIndex)
                }
            });
        },
        joinExistingSessionSpectator(sessionName) {
            ServerApi.sendChooseExistingSessionSpectatorMessage(sessionName);
        }
    };
}