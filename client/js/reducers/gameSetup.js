import JassAppConstants from '../jassAppConstants';

export const GameSetupStep = {
    CONNECTING: 'CONNECTING',
    SET_PLAYER_NAME: 'SET_PLAYER_NAME',
    CHOOSE_SESSION: 'CHOOSE_SESSION',
    CHOOSE_TEAM: 'CHOOSE_TEAM',
    WAIT_FOR_PLAYERS: 'WAIT_FOR_PLAYERS',
    FINISHED: 'FINISHED'
};

const initialState = {
    step: GameSetupStep.CONNECTING
};

export default (state = initialState, {type, data}) => {
    switch (type) {
        case JassAppConstants.REQUEST_PLAYER_NAME:
            return {
                step: GameSetupStep.SET_PLAYER_NAME
            };
        case JassAppConstants.REQUEST_SESSION_CHOICE:
            return {
                step: GameSetupStep.CHOOSE_SESSION,
                sessions: data
            };
        case JassAppConstants.CHOOSE_SESSION_PARTIAL:
            return {
                step: GameSetupStep.CHOOSE_TEAM,
                chosenSession: data
            };
        case JassAppConstants.SESSION_JOINED:
        case JassAppConstants.BROADCAST_TOURNAMENT_RANKING_TABLE:
        case JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR:
            return {
                step: GameSetupStep.FINISHED
            };
        default:
            return state;
    }
}
