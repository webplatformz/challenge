'use strict';

import React from 'react';
import JassActions from "../jassActions";

export default React.createClass({
    addBot(sessionName, chosenTeamIndex) {
        //JassActions.joinBot(sessionName, chosenTeamIndex);
        console.log("sessionName " + sessionName + " teamIndex " + chosenTeamIndex)
    },

    render() {
        let players = this.props.players || [],
            playerSeating = this.props.playerSeating,
            nextStartingPlayerIndex = this.props.nextStartingPlayerIndex,
            roundPlayerIndex = this.props.roundPlayerIndex;

        return (
            <div id="playerNames">
                {players.map((player, index) => {
                    let classes = [];

                    if (nextStartingPlayerIndex === index) {
                        classes.push('active');
                    }

                    if (roundPlayerIndex === index) {
                        classes.push('round-player');
                    }

                    return (
                        <div key={player.id} id={'player-' + playerSeating[index]} className={classes.join(' ')}>
                            <span onClick={() => this.addBot("todoSession", player.seatId)}>(+) </span>
                            {player.name}<object data="/images/startingPlayer.svg" type="image/svg+xml"></object>
                        </div>);
                })}
            </div>
        );
    }
});
