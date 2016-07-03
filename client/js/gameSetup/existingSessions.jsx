import React from 'react';
import JassActions from '../jassActions';

const ExistingSessions = ({sessions = []}) => {
    return (
        <div className="session-choice">
            <ul className={(!sessions.length) ? 'hidden' : ''}>
                {sessions.map((sessionName) => {
                    return (
                        <li key={sessionName}>
                            <div onClick={() => JassActions.joinExistingSession(sessionName)}>{sessionName}</div>
                            <div onClick={() => JassActions.joinExistingSessionAsSpectator(sessionName)}>S</div>
                        </li>);
                })}
            </ul>
        </div>
    );
};

ExistingSessions.propTypes = {
    sessions: React.PropTypes.array
};

export default ExistingSessions;
