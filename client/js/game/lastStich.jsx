import React from 'react';
import {GameState} from './gameStore';
import JassActions from '../jassActions';

let cards = [],
    startingPlayerIndex = 0,
    playerSeating = ['a', 'b', 'c', 'd'];

export default (props) => {

    let imagePath = '/images/cards/' + props.cardType + '/';
    
    if (props.state === GameState.STICH) {
        cards = props.cards;
        startingPlayerIndex = props.startingPlayerIndex;
        playerSeating = props.playerSeating;
    }
    
    return (
        <div id="lastStich" className={(cards.length !== 4) ? 'hidden' : ''}>
            <img src="./images/carddeck.svg"
                 onClick={() => JassActions.toggleShowLastStich()}
                 className={(props.showLastStich) ? 'hidden' : ''}
            />
            <div className={(props.showLastStich) ? '' : 'hidden'}>
                <img src="./images/close.svg"
                     onClick={() => JassActions.toggleShowLastStich()}
                     id="closeButton"
                />
                <div>{cards.map((card, index) => {
                    let actPlayerIndex = (startingPlayerIndex + index) % 4;
                    return (
                        <img key={card.color + '_' + card.number} className={'card-' + playerSeating[actPlayerIndex]}
                             src={imagePath + card.color.toLowerCase() + '_' + card.number + '.gif'}
                        />
                    );
                })}
                </div>
            </div>
        </div>
    );
};
