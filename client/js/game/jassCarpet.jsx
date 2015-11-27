'use strict';

import React from 'react';
import PlayerNames from './playerNames.jsx';
import TableCards from './tableCards.jsx';
import Trumpf from './trumpf.jsx';

export default React.createClass({

    render: function () {
        let playerSeating = this.props.playerSeating,
            cardType = this.props.cardType;

        return (
            <div id="jassCarpet">
                <PlayerNames players={this.props.players} playerSeating={playerSeating} nextStartingPlayerIndex={this.props.nextStartingPlayerIndex} roundPlayerIndex={this.props.roundPlayerIndex}></PlayerNames>
                <TableCards cardType={cardType} cards={this.props.cards} startingPlayerIndex={this.props.startingPlayerIndex} playerSeating={playerSeating}></TableCards>
                <Trumpf mode={this.props.mode} color={this.props.color} cardType={cardType}></Trumpf>
            </div>
        );
    }
});
