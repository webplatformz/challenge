import React from 'react';
import {CardColor} from '../../../shared/deck/cardColor';
import {GameMode} from '../../../shared/game/gameMode';
import JassActions from '../jassActions';

function chooseTrumpf(mode, color) {
    JassActions.chooseTrumpf(mode, color);
}

export default (props) => {

    let imagePath = '/images/trumpf/',
        cardTypeImagePath = imagePath + props.cardType + '/';

    return (
        <div id="requestTrumpf">
            <img onClick={() => chooseTrumpf(GameMode.TRUMPF, CardColor.HEARTS)} src={cardTypeImagePath + 'hearts.png'}/>
            <img onClick={() => chooseTrumpf(GameMode.TRUMPF, CardColor.DIAMONDS)} src={cardTypeImagePath + 'diamonds.png'}/>
            <img onClick={() => chooseTrumpf(GameMode.TRUMPF, CardColor.CLUBS)} src={cardTypeImagePath + 'clubs.png'}/>
            <img onClick={() => chooseTrumpf(GameMode.TRUMPF, CardColor.SPADES)} src={cardTypeImagePath + 'spades.png'}/>
            <img onClick={() => chooseTrumpf(GameMode.UNDEUFE)} src={imagePath + 'undeufe.jpg'}/>
            <img onClick={() => chooseTrumpf(GameMode.OBEABE)} src={imagePath + 'obeabe.jpg'}/>
            {(() => {
                if (!props.isGeschoben) {
                    return <img onClick={() => chooseTrumpf(GameMode.SCHIEBE)} src={imagePath + 'schiebe.jpg'}/>;
                }
            })()}
        </div>
    );
};
