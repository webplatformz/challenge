'use strict';

import React from 'react';
import JassActions from "../jassActions";

export default React.createClass({
    addBot(sessionName, seatId) {
        JassActions.joinBot(sessionName, Number(seatId) % 2);
        //TODO cleanup
        console.log("sessionName " + sessionName + " teamIndex " + seatId % 2)
    },

    render() {
        let players = this.props.players || [],
            playerSeating = this.props.playerSeating,
            nextStartingPlayerIndex = this.props.nextStartingPlayerIndex,
            roundPlayerIndex = this.props.roundPlayerIndex,
            chosenSession = this.props.chosenSession || {};

        return (
            <div id="playerNames">
                {players.map((player, index) => {
                    let classes = [];
                    let addBotClasses = ['addBotIcon'];

                    if (nextStartingPlayerIndex === index) {
                        classes.push('active');
                    }

                    if (roundPlayerIndex === index) {
                        classes.push('round-player');
                    }

                    if (!player.isEmptyPlaceholder){
                        addBotClasses.push('hidden');
                    }

                    return (
                        <div key={player.id} id={'player-' + playerSeating[index]} className={classes.join(' ')}>
                            <span className={addBotClasses.join(' ')} onClick={() => this.addBot(chosenSession, player.seatId)}>(+) </span>
                            {player.name}<object data="/images/startingPlayer.svg" type="image/svg+xml"></object>
                        </div>);
                })}
            </div>
        );
    }
});
