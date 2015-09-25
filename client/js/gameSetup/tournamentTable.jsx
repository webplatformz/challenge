'use strict';

import React from 'react';
import GameSetupStore from './gameSetupStore';
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

                    <tr>
                        <td>1.</td>
                        <td>Dummy</td>
                        <td>3</td>
                    </tr>
                </table>
            </div>
        )
    }
});