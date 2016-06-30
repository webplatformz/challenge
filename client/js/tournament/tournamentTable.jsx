import React from 'react';
import JassActions from '../jassActions';
import RegistryBots from './registryBots.jsx';

export default ({rankingTable, registryBots, started}) => {
    setTimeout(JassActions.requestRegistryBots);
    
    return (
        <div id="tournamentDashboard">
            <RegistryBots bots={registryBots}/>
            <div id="tournamentTable">
                <h1 className="jumbotron">Current rankings</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Connected Clients</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rankingTable.ranking.map((player) => (
                        <tr key={player.playerName}>
                            <td>{player.rank}</td>
                            <td>{player.playerName}</td>
                            <td>{player.connectedClients}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <h1 className="jumbotron">Pairing Results</h1>
                <table className="pairings">
                    <tbody>
                    {rankingTable.pairingResults.map((pairing, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    {(() => {
                                        if (pairing.firstPlayerWon) {
                                            return (
                                                <object className="winner" data="/images/star.svg"
                                                        type="image/svg+xml"
                                                />);
                                        }
                                    })()}
                                    {pairing.player1}
                                </td>
                                <td>
                                    {(() => {
                                        if (!pairing.firstPlayerWon) {
                                            return (
                                                <object className="winner" data="/images/star.svg"
                                                        type="image/svg+xml"
                                                />);
                                        }
                                    })()}
                                    {pairing.player2}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {(() => {
                    if (!started) {
                        return (
                            <button type="button" name="startTournament" onClick={JassActions.startTournament}>
                                Start!
                            </button>
                        );
                    }
                })()}
            </div>
        </div>
    );
};
