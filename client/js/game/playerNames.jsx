import React from 'react';
import JassActions from '../jassActions';

function addBot(sessionName, seatId) {
    JassActions.joinBot(sessionName, Number(seatId) % 2);
}

function isSeatOccupiedOrNotAllowedForBot(players, player) {
    return !player.isEmptyPlaceholder || (player.seatId === 3 && players.find(p => p.seatId===1 && p.isEmptyPlaceholder))
}

export default (props) => {

    let players = props.players || [],
        playerSeating = props.playerSeating,
        nextStartingPlayerIndex = props.nextStartingPlayerIndex,
        roundPlayerIndex = props.roundPlayerIndex;

    return (
        <div id="playerNames">
            {players.map(function (player, index) {
                let classes = [];
                let addBotClasses = ['addBotIcon'];

                if (nextStartingPlayerIndex === index) {
                    classes.push('active');
                }

                if (roundPlayerIndex === index) {
                    classes.push('round-player');
                }

                if (isSeatOccupiedOrNotAllowedForBot(players, player))
                {
                    addBotClasses.push('hidden');
                }

                return (
                    <div key={player.id} id={'player-' + playerSeating[index]} className={classes.join(' ')}>
                        <span title="Add bot player"><img className={addBotClasses.join(' ')} src="./images/robot.svg" onClick={() => addBot(chosenSession, player.seatId)} /></span>
                        {player.name}<object data="/images/startingPlayer.svg" type="image/svg+xml"/>
                    </div>);
            })}
        </div>
    );
};
