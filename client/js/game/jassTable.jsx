'use strict';

import React from 'react';
import {default as GameStore, GameState, PlayerType} from './gameStore';
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
                <CardTypeSwitcher cardType={state.cardType}/>
                <JassCarpet
                    cardType={state.cardType}
                    players={players}
                    playerSeating={playerSeating}
                    cards={tableCards}
                    startingPlayerIndex={state.startingPlayerIndex}
                    nextStartingPlayerIndex={state.nextStartingPlayerIndex}
                    mode={state.mode}
                    color={state.color}
                    roundPlayerIndex={state.roundPlayerIndex}
                    collectStich={state.collectStich}/>
                <Points teams={teams} />
                {(() => {
                    if (state.playerType === PlayerType.PLAYER) {
                        return <PlayerCards cards={playerCards}
                                            cardType={state.cardType}
                                            state={state.status}
                                            tableCards={state.tableCards}
                                            mode={state.mode}
                                            color={state.color}/>;
                    }
                })()}
                {(() => {
                    if (state.status === GameState.REQUESTING_TRUMPF) {
                        return <RequestTrumpf isGeschoben={state.isGeschoben} cardType={state.cardType}/>;
                    }
                })()}
                {(() => {
                    if (state.playerType === PlayerType.SPECTATOR) {
                        return <SpectatorControls/>;
                    }
                })()}
            </div>
        );
    }
});
