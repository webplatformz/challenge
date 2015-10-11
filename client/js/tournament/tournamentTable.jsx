'use strict';

import React from 'react';
import GameSetupStore from './../gameSetup/gameSetupStore';
import JassActions from '../jassActions';

module.exports = React.createClass({
    render: function () {
        let rankingTable = this.props.rankingTable;

        return (
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
                        {rankingTable.ranking.map(function (player) {
                            return (
                                <tr key="{player.playerName}">
                                    <td>{player.rank}</td>
                                    <td>{player.playerName}</td>
                                    <td>{player.connectedClients}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button type="button" name="startTournament" onClick={JassActions.startTournament}>Start!</button>
            </div>
        )
    }
});