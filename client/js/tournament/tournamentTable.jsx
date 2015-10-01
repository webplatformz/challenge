'use strict';

import React from 'react';
import GameSetupStore from './../gameSetup/gameSetupStore';
import JassActions from '../jassActions';

module.exports = React.createClass({
    render: function () {
        return (
            <div id="tournamentTable">
                <h1 className="jumbotron">Current rankings</h1>
                <table>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Wins</th>
                    </tr>
                    {this.props.ratings.map(function(rating) {
                        return (<tr><td>-</td><td>{rating.player}</td><td>{rating.wins}</td></tr>);
                    })}
                </table>
            </div>
        )
    }
});