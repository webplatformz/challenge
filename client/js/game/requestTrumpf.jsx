'use strict';

import React from 'react';
import {CardColor} from '../../../shared/deck/card.js';
import GameMode from '../../../shared/game/gameMode.js';
import JassActions from '../jassActions.js';

export default React.createClass({

    chooseTrumpf: function(mode, color) {
        JassActions.chooseTrumpf(mode, color);
    },

    render: function () {
        let imagePath = '/images/trumpf/',
            cardTypeImagePath = imagePath + this.props.cardType + '/';

        return (
            <div id="requestTrumpf">
                <img onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.HEARTS)} src={cardTypeImagePath + 'hearts.png'} />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.DIAMONDS)} src={cardTypeImagePath + 'diamonds.png'} />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.CLUBS)} src={cardTypeImagePath + 'clubs.png'} />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.SPADES)} src={cardTypeImagePath + 'spades.png'} />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.UNDEUFE, undefined)} src={imagePath + 'undeufe.jpg'} />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.OBEABE, undefined)} src={imagePath + 'obeabe.jpg'} />
                {((component) => {
                    if (!component.props.isGeschoben) {
                        return <img onClick={component.chooseTrumpf.bind(null, GameMode.SCHIEBE, undefined)} src={imagePath + 'schiebe.jpg'} />;
                    }
                })(this)}
            </div>
        );
    }
});
