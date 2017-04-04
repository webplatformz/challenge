import React from 'react';
import PlayerNames from './playerNames.jsx';
import TableCards from './tableCards.jsx';
import LastStich from './lastStich.jsx';
import Trumpf from './trumpf.jsx';

export default ({
                    color,
                    mode,
                    cards,
                    players,
                    nextStartingPlayerIndex,
                    roundPlayerIndex,
                    startingPlayerIndex,
                    playerSeating,
                    cardType,
                    collectStich,
                    chosenSession,
                    lastStichCards,
                    lastStichStartingPlayerIndex,
                    showLastStich,
                    status
                }) => (
    <div id="jassCarpet">
        <PlayerNames players={players}
                     playerSeating={playerSeating}
                     nextStartingPlayerIndex={nextStartingPlayerIndex}
                     roundPlayerIndex={roundPlayerIndex}
                     chosenSession={chosenSession}
        />
        <TableCards cardType={cardType}
                    cards={cards}
                    startingPlayerIndex={startingPlayerIndex}
                    playerSeating={playerSeating}
                    collectStich={collectStich}
                    state={status}
        />
        <Trumpf mode={mode} color={color} cardType={cardType} />
        <LastStich cards={lastStichCards}
                   state={status}
                   cardType={cardType}
                   playerSeating={playerSeating}
                   startingPlayerIndex={lastStichStartingPlayerIndex}
                   showLastStich={showLastStich}
        />
    </div>
);
