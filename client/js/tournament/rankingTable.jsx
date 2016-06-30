import React from 'react';

export default ({ranking = []}) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Connected Clients</th>
            </tr>
            </thead>
            <tbody>
            {ranking.map((player) => (
                <tr key={player.playerName}>
                    <td>{player.rank}</td>
                    <td>{player.playerName}</td>
                    <td>{player.connectedClients}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};
