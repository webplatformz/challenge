import React from 'react';

export default ({ teams }) => (
    <div id="winnerNotification">
        <div className="winner-modal">
            <div className="winner-title">
                <h3>{teams.find(team => team.winner).players.map(player => player.name).join(' & ')} win!</h3>
            </div>
            <div className="winner-body">
                <h3>
                    {teams[0].name}<br />
                    <small>{teams[0].players.map(player => player.name).join(' & ')}</small>
                </h3>
                <p>{teams[0].points} Points</p>
                <h3>
                    {teams[1].name}<br />
                    <small>{teams[1].players.map(player => player.name).join(' & ')}</small>
                </h3>
                <p>{teams[1].points} Points</p>
                <button
                    onClick={window.location.reload}
                    className="winner-button"
                >
                    New Game
                </button>
            </div>
        </div>
    </div>
);
