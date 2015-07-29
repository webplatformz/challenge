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
        let sessionName = document.querySelector('input[name=createNewSession]').value;
        JassActions.createNewSession(sessionName);
    },

    render: function () {
        let status = this.props.setupState.status,
            sessions = this.props.setupState.sessions || [];

        return (
            <div id="chooseSession" className={(status !== GameSetupStore.GameSetupState.CHOOSE_SESSION ? 'hidden' : '')}>
                <h1 className="jumbotron">Choose Session</h1>
                <div>
                    <ul className={(!this.hasSessions) ? 'hidden' : ''}>
                        {sessions.map(function(session) {
                            return <li key={session} onClick={this.joinExistingSession(session)}>{session}</li>;
                        })}
                    </ul>
                </div>
                <div>
                    <input type="text" name="createNewSession"></input>
                    <button type="button" name="createNewSession" onClick={this.createNewSession}>Create New Session</button>
                </div>
                <div>
                    <button type="button" name="autoJoin" onClick={JassActions.autojoinSession}>Join first possible Session</button>
                </div>
            </div>
        )
    }
});