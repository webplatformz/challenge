import React from 'react';
import { GameState } from './gameStore';
import JassActions from '../jassActions';

export default ({
                    cards,
                    showLastStich,
                    playerSeating,
                    startingPlayerIndex,
                    cardType
                }) => (
    <div id="lastStich" className={(cards.length !== 4) ? 'hidden' : ''}>
        <img src="./images/carddeck.svg"
             onClick={() => JassActions.toggleShowLastStich()}
             className={(showLastStich) ? 'hidden' : ''}
        />
        <div className={(showLastStich) ? '' : 'hidden'}>
            <img src="./images/close.svg"
                 onClick={() => JassActions.toggleShowLastStich()}
                 id="closeButton"
            />
            <div>
                {cards.map((card, index) => (
                    <img key={card.color + '_' + card.number}
                         className={`card-${playerSeating[(startingPlayerIndex + index) % 4]}`}
                         src={`/images/cards/${cardType}/${card.color.toLowerCase()}_${card.number}.gif`}
                    />
                ))}
            </div>
        </div>
    </div>
);
