import React from 'react';
import {GameSetupStep} from '../reducers/gameSetup';

const ChooseTeam = ({step, chosenSession = {}}) => {

    return (
        <div id="chooseTeam" className={(step !== GameSetupStep.CHOOSE_TEAM ? 'hidden' : '')}>
            <h1 className="jumbotron">Joining Session {chosenSession.sessionName}</h1>
            <h2>Choose your preferred team</h2>
            <div className="team-choice">
                <button type="button" onClick={() => chosenSession.joinSession(0)}>Team 1</button>
                <button type="button" onClick={() => chosenSession.joinSession(1)}>Team 2</button>
                <button type="button" onClick={() => chosenSession.joinSession()}>Join any team</button>
            </div>
        </div>
    );
};

ChooseTeam.propTypes = {
    step: React.PropTypes.oneOf(Object.keys(GameSetupStep)),
    chosenSession: React.PropTypes.shape({
        sessionName: React.PropTypes.string,
        joinSession: React.PropTypes.func
    })
};

export default ChooseTeam;
