'use strict';

import React from 'react';
import GameSetupStore from './gameSetupStore.js';

export default React.createClass({

    render: function () {
        let status = this.props.setupState.status,
            chosenSession = this.props.setupState.chosenSession;

        return (
            <div id="chooseTeam" className={(status !== GameSetupStore.GameSetupState.CHOOSE_TEAM ? 'hidden' : '')}>
                <h1 className="jumbotron">Choose Your Preferred Team ... </h1>
                <div className="team-choice">
                    <div>
                        <button type="button" name="team1" onClick={() => chosenSession.joinSession(0)}>
                            Team 1
                        </button>
                        <button type="button" name="team2" onClick={() => chosenSession.joinSession(1)}>
                            Team 2
                        </button>
                    </div>
                    <div></div>
                    <div>
                        <button type="button" name="autoJoin" onClick={() => chosenSession.joinSession()}>
                            Just Join Any Team
                        </button>
                    </div>
                </div>
            </div>
        )
    }

});