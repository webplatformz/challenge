import React from 'react';
import {CardType} from './gameStore';
import JassActions from '../jassActions';

export default () => {
    return (
        <div id="cardTypeSwitcher">
            {Object.getOwnPropertyNames(CardType).map((cardTypeKey) => {
                let cardType = CardType[cardTypeKey],
                    imagePath = '/images/trumpf/' + cardType;

                return (
                    <div key={cardType}>
                        <a onClick={() => JassActions.changeCardType(cardType)}>
                            <img src={imagePath + '/hearts.png'}/>
                            <img src={imagePath + '/diamonds.png'}/>
                            <img src={imagePath + '/clubs.png'}/>
                            <img src={imagePath + '/spades.png'}/>
                        </a>
                    </div>
                );
            })}
        </div>
    );
};
