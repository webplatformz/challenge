import React from 'react';


export default ({ranking = []}) => {
    const hasRating = ranking.length !== 0 && ranking[0].rating;

    return (
        <table>
            <thead>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                {hasRating && <th>Rating (Glicko)</th>}
                <th>Connected Clients</th>
            </tr>
            </thead>
            <tbody>
            {ranking.map((player) => (
                <tr key={player.playerName}>
                    <td>{player.rank}</td>
                    <td>{player.playerName}</td>
                    {hasRating && <td>{Math.floor(player.rating)}</td>}
                    <td>{player.connectedClients}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
};
