'use strict';

import React from 'react';
import GameSetupStore from './../gameSetup/gameSetupStore';
import JassActions from '../jassActions';

module.exports = React.createClass({

    createNewSession: function(event) {
/*        let inputElement = event.target,
            sessionName = inputElement.value;

        if (event.charCode === 13 && sessionName.trim()) {
            inputElement.disabled = true;
            JassActions.createNewSession(sessionName);
        }*/
    },

    render: function () {
        let status = this.props.setupState.status;

        return (
            <div id="createTournament" className={(status !== GameSetupStore.GameSetupState.CHOOSE_SESSION ? 'hidden' : '')}>
                <h1 className="jumbotron">Create tournament</h1>
                <input type="text" placeholder="Enter tournament name..."></input>
            </div>
        )
    }
});