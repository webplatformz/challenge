'use strict';

import React from 'react';
import JassActions from '../jassActions.js';
import RegistryBots from './registryBots.jsx';

export default React.createClass({

    componentWillMount() {
        setTimeout(() => {
            JassActions.requestRegistryBots();
        });
    },
    
    render() {
        let rankingTable = this.props.rankingTable,
            registryBots = this.props.registryBots;
        return (
            <div id="tournamentTable">
                {(registryBots)?<RegistryBots bots={ registryBots }/> : undefined}
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
                        {rankingTable.ranking.map((player) => {
                            return (
                                <tr key={player.playerName}>
                                    <td>{player.rank}</td>
                                    <td>{player.playerName}</td>
                                    <td>{player.connectedClients}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <h1 className="jumbotron">Pairing Results</h1>
                <table className="pairings">
                    {rankingTable.pairingResults.map((pairing, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    {((pairing) => {
                                        if (pairing.firstPlayerWon) {
                                            return <object className="winner" data="/images/star.svg" type="image/svg+xml"></object>;
                                        }
                                    })(pairing)}
                                    {pairing.player1}
                                </td>
                                <td>
                                    {((pairing) => {
                                        if (!pairing.firstPlayerWon) {
                                            return <object className="winner" data="/images/star.svg" type="image/svg+xml"></object>;
                                        }
                                    })(pairing)}
                                    {pairing.player2}
                                </td>
                            </tr>
                        );
                    })}
                </table>
                {((component) => {
                    if (!component.props.started) {
                        return <button type="button" name="startTournament" onClick={JassActions.startTournament}>Start!</button>;
                    }
                })(this)}
            </div>
        )
    }
});
