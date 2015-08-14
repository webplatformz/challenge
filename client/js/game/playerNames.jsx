'use strict';

let React = require('react');

module.exports = React.createClass({

    render: function () {
        let players = this.props.players || [],
            playerSeating = this.props.playerSeating,
            nextStartingPlayerIndex = this.props.nextStartingPlayerIndex;

        return (
            <div id="playerNames">
                {players.map(function(player, index) {
                    return (
                        <div key={player.id} id={'player-' + playerSeating[index]} className={(nextStartingPlayerIndex === index) ? 'active' : ''}>
                            {player.name}
                        </div>);
                })}
            </div>
        );
    }
});
