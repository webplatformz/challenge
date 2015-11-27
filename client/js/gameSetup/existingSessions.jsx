'use strict';

import React from 'react';
import JassActions from '../jassActions';

export default React.createClass({

    hasSessions: function(sessions) {
        return sessions.length;
    },

    joinExistingSession: function(sessionName) {
        JassActions.joinExistingSession(sessionName);
    },

    joinExistingSessionAsSpectator: function(sessionName) {
        JassActions.joinExistingSessionAsSpectator(sessionName);
    },

    render: function () {
        let sessions = this.props.sessions || [];

        return (
            <div className="session-choice">
                <ul className={(!this.hasSessions(sessions)) ? 'hidden' : ''}>
                    {sessions.map(function(session) {
                        return (
                            <li key={session}>
                                <div onClick={this.joinExistingSession.bind(null, session)}>{session}</div>
                                <div onClick={this.joinExistingSessionAsSpectator.bind(null, session)}>S</div>
                            </li>);
                    }.bind(this))}
                </ul>
            </div>
        )
    }
});
