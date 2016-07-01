import React from 'react';
import {GameSetupState} from './gameSetupStore';

export default (props) => {

    const status = props.setupState.status;
    const chosenSession = props.setupState.chosenSession || {};

    return (
        <div id="chooseTeam" className={(status !== GameSetupState.CHOOSE_TEAM ? 'hidden' : '')}>
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
