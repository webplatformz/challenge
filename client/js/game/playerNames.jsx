'use strict';

import React from 'react';
import JassActions from "../jassActions";

export default React.createClass({
    addBot(sessionName, seatId) {
        JassActions.joinBot(sessionName, Number(seatId) % 2);
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

                    if (!player.isEmptyPlaceholder || (player.seatId === 3 && players.find(p => p.seatId===1 && p.isEmptyPlaceholder)))
                    {
                        addBotClasses.push('hidden');
                    }

                    return (
                        <div key={player.id} id={'player-' + playerSeating[index]} className={classes.join(' ')}>
                            <span title="Add bot player"><img className={addBotClasses.join(' ')} src="./images/robot.svg" onClick={() => this.addBot(chosenSession, player.seatId)}></img></span>
                            {player.name}<object className="startingPlayerIcon" data="/images/startingPlayer.svg" type="image/svg+xml"></object>
                        </div>);
                })}
            </div>
        );
    }
});
