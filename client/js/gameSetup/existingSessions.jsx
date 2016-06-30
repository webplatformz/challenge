import React from 'react';
import JassActions from '../jassActions';

export default (props) => {

    let sessions = props.sessions || [];

    return (
        <div className="session-choice">
            <ul className={(!sessions.length) ? 'hidden' : ''}>
                {sessions.map((session) => {
                    return (
                        <li key={session}>
                            <div onClick={() => JassActions.joinExistingSession(session)}>{session}</div>
                            <div onClick={() => JassActions.joinExistingSessionAsSpectator(session)}>S</div>
                        </li>);
                })}
            </ul>
        </div>
    );
};
