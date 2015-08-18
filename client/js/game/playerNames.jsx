'use strict';

let React = require('react');

module.exports = React.createClass({

    render: function () {
        let players = this.props.players || [],
            playerSeating = this.props.playerSeating,
            nextStartingPlayerIndex = this.props.nextStartingPlayerIndex,
            roundPlayerIndex = this.props.roundPlayerIndex;

        return (
            <div id="playerNames">
                {players.map(function(player, index) {
                    let classes = [];

                    if (nextStartingPlayerIndex === index) {
                        classes.push('active');
                    }

                    if (roundPlayerIndex === index) {
                        classes.push('round-player');
                    }

                    return (
                        <div key={player.id} id={'player-' + playerSeating[index]} className={classes.join(' ')}>
                            {player.name}<object data="/images/startingPlayer.svg" type="image/svg+xml"></object>
                        </div>);
                })}
            </div>
        );
    }
});
