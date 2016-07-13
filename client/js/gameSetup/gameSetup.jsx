import React from 'react';
import RequestPlayerName from './requestPlayerName.jsx';
import Connecting from './connecting.jsx';
import ChooseSession from './chooseSession.jsx';
import ChooseTeam from './chooseTeam.jsx';
import {GameSetupStep} from '../reducers/gameSetup';
import {connect} from 'react-redux';
import gameSetupDispatchFunctions from './gameSetupDispatchFunctions';

export const GameSetupComponent = ({
    step,
    sessions,
    chosenSession,
    autojoinSession,
    createNewSession,
    joinExistingSession,
    joinExistingSessionSpectator
}) => {
    return (
        <div id="gameSetup" className={(step === GameSetupStep.FINISHED) ? 'finished' : undefined}>
            <Connecting step={step}/>
            <RequestPlayerName step={step}/>
            <ChooseSession
                step={step}
                sessions={sessions}
                autojoinSession={autojoinSession}
                createNewSession={createNewSession}
                joinExistingSession={joinExistingSession}
                joinExistingSessionSpectator={joinExistingSessionSpectator}
            />
            <ChooseTeam step={step} chosenSession={chosenSession}/>
        </div>
    );
};

GameSetupComponent.propTypes = {
    step: React.PropTypes.oneOf(Object.keys(GameSetupStep)),
    sessions: React.PropTypes.array,
    chosenSession: React.PropTypes.shape({
        sessionName: React.PropTypes.string,
        joinSession: React.PropTypes.func
    }),
    autojoinSession: React.PropTypes.func,
    createNewSession: React.PropTypes.func,
    joinExistingSession: React.PropTypes.func,
    joinExistingSessionSpectator: React.PropTypes.func
};

export default connect(
    (state) => state.gameSetup,
    (dispatch) => gameSetupDispatchFunctions(dispatch)
)(GameSetupComponent);
