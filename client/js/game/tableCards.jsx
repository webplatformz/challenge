'use strict';

import React from 'react';
import JassActions from '../jassActions';


export default React.createClass({

    shouldComponentUpdate(nextProps){
       return nextProps.collectStich !== false;
    },
    render() {
        let cards = this.props.cards || [],
            startingPlayerIndex = this.props.startingPlayerIndex,
            playerSeating = this.props.playerSeating,
            imagePath = '/images/cards/' + this.props.cardType + '/';

        return (
            <div id="tableCards" onClick={JassActions.collectStich}>
                {cards.map((card, index) => {
                    let actPlayerIndex = (startingPlayerIndex + index) % 4;
                    return (
                        <img key={card.color + '_' + card.number} className={'card-' + playerSeating[actPlayerIndex]} src={imagePath + card.color.toLowerCase() + '_' + card.number + '.gif'} />
                    );
                })}
            </div>
        );
    }
});
