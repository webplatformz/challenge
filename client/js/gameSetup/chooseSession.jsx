'use strict';

import React from 'react';
import ExistingSessions from './existingSessions.jsx';
import GameSetupStore from './gameSetupStore';
import JassActions from '../jassActions';

module.exports = React.createClass({

    createNewSession: function(event) {
        let inputElement = event.target,
            sessionName = inputElement.value;

        if (event.charCode === 13 && sessionName.trim()) {
            inputElement.disabled = true;
            JassActions.createNewSession(sessionName);
        }
    },

    render: function () {
        let status = this.props.setupState.status;

        return (
            <div id="chooseSession" className={(status !== GameSetupStore.GameSetupState.CHOOSE_SESSION ? 'hidden' : '')}>
                <h1 className="jumbotron">Choose Session</h1>
                <ExistingSessions sessions={this.props.setupState.sessions}></ExistingSessions>
                <div className="session-choice">
                    <input type="text" name="createNewSession" placeholder="New Sessionname" onKeyPress={this.createNewSession}></input>
                </div>
                <div className="session-choice">
                    <button type="button" name="autoJoin" onClick={JassActions.autojoinSession}>Just Join!</button>
                </div>
            </div>
        )
    }
});