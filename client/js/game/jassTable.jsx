'use strict';


import React from 'react';
import GameStore from './gameStore';
import CardTypeSwitcher from './cardTypeSwitcher.jsx';
import PlayerCards from './playerCards.jsx';
import RequestTrumpf from './requestTrumpf.jsx';
import JassCarpet from './jassCarpet.jsx';
import Points from './points.jsx';
import SpectatorControls from './spectatorControls.jsx';

export default React.createClass({

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
            tableCards = state.tableCards || [],
            teams = state.teams || [];

        return (
            <div id="jassTable">
                <CardTypeSwitcher cardType={state.cardType}></CardTypeSwitcher>
                <JassCarpet
                    cardType={state.cardType}
                    players={players}
                    playerSeating={playerSeating}
                    cards={tableCards}
                    startingPlayerIndex={state.startingPlayerIndex}
                    nextStartingPlayerIndex={state.nextStartingPlayerIndex}
                    mode={state.mode}
                    color={state.color}
                    roundPlayerIndex={state.roundPlayerIndex}>
                </JassCarpet>
                <Points teams={teams} />
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
                {(() => {
                    if (state.playerType === GameStore.PlayerType.SPECTATOR) {
                        return <SpectatorControls></SpectatorControls>;
                    }
                })()}
            </div>
        );
    }
});
