import React from 'react';
import RequestPlayerName from './requestPlayerName.jsx';
import Connecting from './connecting.jsx';
import ChooseSession from './chooseSession.jsx';
import ChooseTeam from './chooseTeam.jsx';
import {GameSetupStep} from '../reducers/gameSetup';
import {connect} from 'react-redux';
import * as GameSetupDispatchFunctions from './gameSetupDispatchFunctions';

export const GameSetupComponent = ({step, sessions, chosenSession}) => {
    return (
        <div id="gameSetup" className={(step === GameSetupStep.FINISHED) ? 'finished' : undefined}>
            <Connecting step={step}/>
            <RequestPlayerName step={step}/>
            <ChooseSession step={step} sessions={sessions}/>
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
    })
};

export default connect(
    (state) => state.gameSetup,
    (dispatch) => GameSetupDispatchFunctions.create(dispatch)
)(GameSetupComponent);
