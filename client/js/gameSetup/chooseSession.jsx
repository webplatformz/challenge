import React from 'react';
import ExistingSessions from './existingSessions.jsx';
import {GameSetupState} from './gameSetupStore';
import {SessionType} from '../../../shared/session/sessionType';

const ChooseSession = ({
    step,
    sessions,
    createNewSession,
    autojoinSession,
    joinExistingSession,
    joinExistingSessionAsSpectator
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
                joinExistingSessionAsSpectator={joinExistingSessionAsSpectator}
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

ChooseSession.propTypes = {
    step: React.PropTypes.string,
    sessions: React.PropTypes.array,
    createNewSession: React.PropTypes.func,
    autojoinSession: React.PropTypes.func,
    joinExistingSession: React.PropTypes.func,
    joinExitingSessionAsSpectator: React.PropTypes.func
};

export default ChooseSession;
