'use strict';

import React from 'react';
import CollectStichHint from './collectStichHint.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {GameState} from './gameStore';

let cards =[];
export default React.createClass({

    render() {
        if(this.props.collectStich !== false){
            cards = this.props.cards || [];
        }
        let startingPlayerIndex = this.props.startingPlayerIndex,
            playerSeating = this.props.playerSeating,
            imagePath = '/images/cards/' + this.props.cardType + '/';
        return (
            <div id="tableCards">
                {(this.props.collectStich === false) ? <CollectStichHint /> : undefined}
                <ReactCSSTransitionGroup transitionName="cards" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                {cards.map((card, index) => {
                    let actPlayerIndex = (startingPlayerIndex + index) % 4;
                    return (
                        <img key={card.color + '_' + card.number} className={'card-' + playerSeating[actPlayerIndex]} src={imagePath + card.color.toLowerCase() + '_' + card.number + '.gif'} />
                    );
                })}
                </ReactCSSTransitionGroup>

            </div>
        );
    }
});
