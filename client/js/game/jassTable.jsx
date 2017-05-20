import React from 'react';
import { default as GameStore, GameState, PlayerType } from './gameStore';
import CardTypeSwitcher from './cardTypeSwitcher.jsx';
import PlayerCards from './playerCards.jsx';
import RequestTrumpf from './requestTrumpf.jsx';
import JassCarpet from './jassCarpet.jsx';
import Points from './points.jsx';
import SpectatorControls from './spectatorControls.jsx';
import WinnerNotification from './winnerNotification.jsx';

export default React.createClass({

    handleGameSetupState() {
        this.setState(GameStore.state);
    },

    componentDidMount() {
        GameStore.addChangeListener(this.handleGameSetupState);
    },

    componentWillUnmount() {
        GameStore.removeChangeListener(this.handleGameSetupState);
    },

    render() {
        let state = this.state || GameStore.state,
            players = state.players || [],
            playerSeating = state.playerSeating,
            playerCards = state.playerCards,
            tableCards = state.tableCards || [],
            teams = state.teams || [];

        return (
            <div id="jassTable">
                <CardTypeSwitcher cardType={state.cardType} />
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
                    collectStich={state.collectStich}
                    chosenSession={state.chosenSession}
                    lastStichCards={state.lastStichCards}
                    lastStichStartingPlayerIndex={state.lastStichStartingPlayerIndex}
                    showLastStich={state.showLastStich}
                    status={state.status}
                />
                <Points teams={teams} showPoints={state.showPoints} />
                {(() => {
                    if (state.playerType === PlayerType.PLAYER) {
                        return (<PlayerCards
                            cards={playerCards}
                            cardType={state.cardType}
                            state={state.status}
                            tableCards={state.tableCards}
                            mode={state.mode}
                            color={state.color}
                        />);
                    }
                })()}
                {(() => {
                    if (state.status === GameState.REQUESTING_TRUMPF) {
                        return <RequestTrumpf isGeschoben={state.isGeschoben} cardType={state.cardType} />;
                    }
                })()}
                {(() => {
                    if (state.playerType === PlayerType.SPECTATOR) {
                        return <SpectatorControls />;
                    }
                })()}
                {(() => {
                    if (state.status === GameState.FINISHED) {
                        return <WinnerNotification teams={teams} />;
                    }
                })()}
            </div>
        );
    },
});
