'use strict';

import React from 'react';
import GameSetupStore from './gameSetupStore.js';

export default React.createClass({

    render: function () {
        const status = this.props.setupState.status;
        const chosenSession = this.props.setupState.chosenSession || {};

        return (
            <div id="chooseTeam" className={(status !== GameSetupStore.GameSetupState.CHOOSE_TEAM ? 'hidden' : '')}>
                <h1 className="jumbotron">Joining Session {chosenSession.sessionName} ...</h1>
                <h2 className = "jumbotron" > Choose Your Preferred Team ... </h2>
                <div className="team-choice">
                    <button type="button" name="team1" onClick= {() => chosenSession.joinSession(0)}>Team 1</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" name="team2" onClick={() => chosenSession.joinSession(1)}>Team 2</button>
                    <br/>
                    <br/>
                    <br/>
                    <button type="button" name="teamAny" onClick={() => chosenSession.joinSession()}>Join Any Team</button>
                </div>
            </div>
        );
    }

});