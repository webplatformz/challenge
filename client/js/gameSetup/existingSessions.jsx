

import React from 'react';
import JassActions from '../jassActions';

export default React.createClass({

    hasSessions(sessions) {
        return sessions.length;
    },

    joinExistingSession(sessionName) {
        JassActions.joinExistingSession(sessionName);
    },

    joinExistingSessionAsSpectator(sessionName) {
        JassActions.joinExistingSessionAsSpectator(sessionName);
    },

    render() {
        let sessions = this.props.sessions || [];

        return (
            <div className="session-choice">
                <ul className={(!this.hasSessions(sessions)) ? 'hidden' : ''}>
                    {sessions.map((session) => {
                        return (
                            <li key={session}>
                                <div onClick={() => this.joinExistingSession(session)}>{session}</div>
                                <div onClick={() => this.joinExistingSessionAsSpectator(session)}>S</div>
                            </li>);
                    })}
                </ul>
            </div>
        );
    }
});
