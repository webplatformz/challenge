import React from 'react';

export default (props) => {

    let players = props.players || [],
        playerSeating = props.playerSeating,
        nextStartingPlayerIndex = props.nextStartingPlayerIndex,
        roundPlayerIndex = props.roundPlayerIndex;

    return (
        <div id="playerNames">
            {players.map(function (player, index) {
                let classes = [];

                if (nextStartingPlayerIndex === index) {
                    classes.push('active');
                }

                if (roundPlayerIndex === index) {
                    classes.push('round-player');
                }

                return (
                    <div key={player.id} id={'player-' + playerSeating[index]} className={classes.join(' ')}>
                        {player.name}
                        <object data="/images/startingPlayer.svg" type="image/svg+xml"/>
                    </div>);
            })}
        </div>
    );
};
