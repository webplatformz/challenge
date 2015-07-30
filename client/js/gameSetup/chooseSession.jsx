'use strict';

let React = require('react'),
    GameSetupStore = require('./gameSetupStore'),
    JassActions = require('../jassActions');

module.exports = React.createClass({

    hasSessions: function() {
        return this.props.setupState.sessions && this.props.setupState.sessions.length;
    },

    joinExistingSession: function(sessionName) {
        JassActions.joinExistingSession(sessionName);
    },

    createNewSession: function() {
        let inputElement = event.target,
            sessionName = inputElement.value;

        if (event.charCode === 13 && sessionName.trim()) {
            inputElement.disabled = true;
            JassActions.createNewSession(sessionName);
        }
    },

    render: function () {
        let status = this.props.setupState.status,
            sessions = this.props.setupState.sessions || [];

        return (
            <div id="chooseSession" className={(status !== GameSetupStore.GameSetupState.CHOOSE_SESSION ? 'hidden' : '')}>
                <h1 className="jumbotron">Choose Session</h1>
                <div className="session-choice">
                    <ul className={(!this.hasSessions()) ? 'hidden' : ''}>
                        {sessions.map(function(session) {
                            return (
                                <li key={session}>
                                    <span  onClick={this.joinExistingSession.bind(null, session)}>{session}</span>
                                </li>);
                        }.bind(this))}
                    </ul>
                </div>
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