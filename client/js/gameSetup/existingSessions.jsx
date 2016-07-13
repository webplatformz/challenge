import React from 'react';

const ExistingSessions = ({sessions = [], joinExistingSession, joinExistingSessionSpectator}) => {
    return (
        <div className="session-choice">
            <ul className={(!sessions.length) ? 'hidden' : ''}>
                {sessions.map((sessionName) => {
                    return (
                        <li key={sessionName}>
                            <div onClick={() => joinExistingSession(sessionName)}>{sessionName}</div>
                            <div onClick={() => joinExistingSessionSpectator(sessionName)}>S</div>
                        </li>);
                })}
            </ul>
        </div>
    );
};

ExistingSessions.propTypes = {
    sessions: React.PropTypes.array,
    joinExistingSession: React.PropTypes.func,
    joinExistingSessionSpectator: React.PropTypes.func
};

export default ExistingSessions;
