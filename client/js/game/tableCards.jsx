'use strict';

import React from 'react';
import CollectStichHint from './collectStichHint.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

let cards =[],
    startingPlayerIndex,
    playerSeating;

export default React.createClass({

    render() {
        if(this.props.collectStich !== false){
            cards = this.props.cards || [];
            startingPlayerIndex = this.props.startingPlayerIndex;
            playerSeating = this.props.playerSeating;
        }

        let imagePath = '/images/cards/' + this.props.cardType + '/';


        const mappedCards = cards.map((card, index) => {
            let actPlayerIndex = (startingPlayerIndex + index) % 4;
            return (
                <img key={card.color + '_' + card.number}
                     className={'card-' + playerSeating[actPlayerIndex]}
                     src={imagePath + card.color.toLowerCase() + '_' + card.number + '.gif'} />
            );
        });

        return (
            <div id="tableCards">
                {(this.props.collectStich === false) ? <CollectStichHint /> : undefined}
                <ReactCSSTransitionGroup
                    transitionAppear={true}
                    transitionName="cards"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={2500}>
                {mappedCards}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});
