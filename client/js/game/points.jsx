'use strict';

let React = require('react');

module.exports = React.createClass({

    render: function () {
        return (
            <div id="points">
                {this.props.teams.map((team) => {
                    return (
                        <div key={team.name}>
                            <h3>{team.name} ({team.players[0].name} & {team.players[1].name})</h3>
                            <span>{team.currentRoundPoints}</span>
                            <span>{team.points}</span>
                        </div>
                    );
                })}
            </div>
        );
    }
});
