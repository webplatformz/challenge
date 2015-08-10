'use strict';


import React from 'react';
import GameStore from './gameStore';
import CardTypeSwitcher from './cardTypeSwitcher.jsx';
import PlayerCards from './playerCards.jsx';
import RequestTrumpf from './requestTrumpf.jsx';
import JassCarpet from './jassCarpet.jsx';

module.exports = React.createClass({

    handleGameSetupState: function () {
        this.setState(GameStore.state);
    },

    componentDidMount: function () {
        GameStore.addChangeListener(this.handleGameSetupState);
    },

    componentWillUnmount: function () {
        GameStore.removeChangeListener(this.handleGameSetupState);
    },

    render: function () {
        let state = this.state || GameStore.state,
            players = state.players || [],
            playerSeating = state.playerSeating,
            playerCards = state.playerCards,
            tableCards = state.tableCards || [];

        return (
            <div id="jassTable">
                <CardTypeSwitcher cardType={state.cardType}></CardTypeSwitcher>
                <JassCarpet
                    cardType={state.cardType}
                    players={players}
                    playerSeating={playerSeating}
                    cards={tableCards}
                    startingPlayerIndex={state.startingPlayerIndex}
                    mode={state.mode}
                    color={state.color}>
                </JassCarpet>
                {(() => {
                    if (state.playerType === GameStore.PlayerType.PLAYER) {
                        return <PlayerCards cards={playerCards} cardType={state.cardType} state={state.status}></PlayerCards>;
                    }
                })()}
                {(() => {
                    if (state.status === GameStore.GameState.REQUESTING_TRUMPF) {
                        return <RequestTrumpf isGeschoben={state.isGeschoben} cardType={state.cardType}></RequestTrumpf>;
                    }
                })()}
            </div>
        );
    }
});
