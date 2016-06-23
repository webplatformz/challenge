'use strict';

import React from 'react';
import GameSetupStore from './gameSetupStore.js';

export default React.createClass({

    render: function () {
        const status = this.props.setupState.status;
        const chosenSession = this.props.setupState.chosenSession || {};

        return (
            <div id="chooseTeam" className={(status !== GameSetupStore.GameSetupState.CHOOSE_TEAM ? 'hidden' : '')}>
                <h1 className="jumbotron">Joining Session {chosenSession.sessionName}</h1>
                <h2> Choose Your Preferred Team</h2>
                <div className="team-choice">
                    <button type="button" onClick={() => chosenSession.joinSession(0)}>Team 1</button>
                    <button type="button" onClick={() => chosenSession.joinSession(1)}>Team 2</button>
                    <button type="button" onClick={() => chosenSession.joinSession()}>Join any team</button>
                </div>
            </div>
        );
    }

});