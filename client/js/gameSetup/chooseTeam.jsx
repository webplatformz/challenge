'use strict';

import React from 'react';
import ExistingSessions from './existingSessions.jsx';
import GameSetupStore from './gameSetupStore.js';
import JassActions from '../jassActions.js';
import {SessionType} from '../../../shared/session/sessionType.js';

export default React.createClass({

    joinTeam1: function() {
        let chosenSession = this.props.setupState.chosenSession;
        chosenSession.joinSession(0);
    },

    joinTeam2: function() {
        let chosenSession = this.props.setupState.chosenSession;
        chosenSession.joinSession(1);
    },

    joinTeamAny: function() {
        let chosenSession = this.props.setupState.chosenSession;
        chosenSession.joinSession();
    },

    render: function () {
        let status = this.props.setupState.status;

        return (
            <div id="chooseTeam" className={(status !== GameSetupStore.GameSetupState.CHOOSE_TEAM ? 'hidden' : '')}>
                <h1 className="jumbotron">Choose Your Preferred Team ... </h1>
                <div className="team-choice">
                    <div>
                        <button type="button" name="team1" onClick={this.joinTeam1}>Team 1</button>
                        <button type="button" name="team2" onClick={this.joinTeam2}>Team 2</button>
                    </div>
                    <div></div>
                    <div>
                        <button type="button" name="autoJoin" onClick={this.joinTeamAny}>Just Join Any Team</button>
                    </div>
                </div>
            </div>
        )
    }

});