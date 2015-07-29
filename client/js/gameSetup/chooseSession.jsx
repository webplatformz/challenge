'use strict';

let React = require('react'),
    GameSetupStore = require('./gameSetupStore'),
    JassActions = require('../jassActions');

module.exports = React.createClass({

    hasSessions: function() {
        return this.props.setupState.sessions && this.props.setupState.sessions.length;
    },

    joinExistingSession: function() {
        let sessionChoice = document.querySelector('select[name=existingSession]').value;
        JassActions.joinExistingSession(sessionChoice);
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
                <form>
                    <div>
                        <select name="existingSession" disabled={!this.hasSessions()}>
                            {sessions.map(function(session) {
                                return <li value={session}>{session}</li>;
                            })}
                        </select>
                        <button type="button" name="joinExisting" onClick={this.joinExistingSession} disabled={!this.hasSessions()}>
                            Join Existing Session
                        </button>
                    </div>
                    <div>
                        <input type="text" name="createNewSession"></input>
                        <button type="button" name="createNewSession" onClick={this.createNewSession}>Create New Session</button>
                    </div>
                    <div>
                        <button type="button" name="autoJoin" onClick={JassActions.autojoinSession}>Join first possible Session</button>
                    </div>
                </form>
            </div>
        )
    }
});