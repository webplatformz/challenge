import React from 'react';
import PlayerNames from './playerNames.jsx';
import TableCards from './tableCards.jsx';
import LastStich from './lastStich.jsx';
import Trumpf from './trumpf.jsx';

export default (props) => {

    let playerSeating = props.playerSeating,
        cardType = props.cardType,
        collectStich = props.collectStich,
        state = props.state;


    return (
        <div id="jassCarpet">
            <PlayerNames players={props.players}
                         playerSeating={playerSeating}
                         nextStartingPlayerIndex={props.nextStartingPlayerIndex}
                         roundPlayerIndex={props.roundPlayerIndex}
                         chosenSession={state.chosenSession}
            />
            <TableCards cardType={cardType}
                        cards={props.cards}
                        startingPlayerIndex={props.startingPlayerIndex}
                        playerSeating={playerSeating}
                        collectStich={collectStich}
                        state={state.status}
            />
            <Trumpf mode={props.mode} color={props.color} cardType={cardType}/>
            <LastStich cards={props.cards}
                       state={props.state.status}
                       cardType={cardType}
                       playerSeating={playerSeating}
                       startingPlayerIndex={props.startingPlayerIndex}
                       showLastStich={state.showLastStich}
            />
        </div>
    );
};
