import React from 'react';
import ExistingSessions from './existingSessions.jsx';
import {GameSetupState} from './gameSetupStore';
import {SessionType} from '../../../shared/session/sessionType';
import {GameSetupStep} from '../reducers/gameSetup';
import {connect} from 'react-redux';
import gameSetupDispatchFunctions from './gameSetupDispatchFunctions';

export const ChooseSessionComponent = ({
    step,
    sessions,
    createNewSession,
    autojoinSession,
    joinExistingSession,
    joinExistingSessionSpectator
}) => {

    function validateAndDispatch(sessionType, asSpectator, event) {
        let inputElement = event.target,
            sessionName = inputElement.value;

        if (event.charCode === 13 && sessionName.trim()) {
            inputElement.disabled = true;
            createNewSession(sessionType, sessionName, asSpectator);
        }
    }

    return (
        <div id="chooseSession" className={(step !== GameSetupState.CHOOSE_SESSION ? 'hidden' : '')}>
            <h1 className="jumbotron">Choose Session</h1>
            <ExistingSessions
                sessions={sessions}
                joinExistingSession={joinExistingSession}
                joinExistingSessionSpectator={joinExistingSessionSpectator}
            />
            <div className="session-choice">
                <input type="text" name="createNewSession" placeholder="Session Name..."
                       onKeyPress={(event) => validateAndDispatch(SessionType.SINGLE_GAME, false, event)}
                />
            </div>
            <div className="session-choice">
                <input type="text" name="createNewTournament" placeholder="Tournament Name..."
                       onKeyPress={(event) => validateAndDispatch(SessionType.TOURNAMENT, true, event)}
                />
            </div>
            <div className="session-choice">
                <button type="button" name="autoJoin" onClick={autojoinSession}>Just Join!</button>
            </div>
        </div>
    );
};

ChooseSessionComponent.propTypes = {
    step: React.PropTypes.oneOf(Object.keys(GameSetupStep)),
    sessions: React.PropTypes.array,
    autojoinSession: React.PropTypes.func,
    createNewSession: React.PropTypes.func,
    joinExistingSession: React.PropTypes.func,
    joinExistingSessionSpectator: React.PropTypes.func
};

export default connect(
    (state) => state.gameSetup,
    (dispatch) => gameSetupDispatchFunctions(dispatch)
)(ChooseSessionComponent);
