'use strict';

let React = require('react'),
    GameStore = require('./gameStore'),
    CardTypeSwitcher = require('./cardTypeSwitcher.jsx'),
    PlayerCards = require('./playerCards.jsx'),
    TableCards = require('./tableCards.jsx'),
    PlayerNames = require('./playerNames.jsx'),
    RequestTrumpf = require('./requestTrumpf.jsx'),
    Trumpf = require('./trumpf.jsx');

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
        let state = this.state || {},
            players = state.players || [],
            playerSeating = state.playerSeating,
            playerCards = state.playerCards,
            tableCards = state.tableCards || [];

        return (
            <div id="jassTable">
                <CardTypeSwitcher cardType={state.cardType}></CardTypeSwitcher>
                <div id="jassCarpet">
                    <PlayerNames players={players} playerSeating={playerSeating}></PlayerNames>
                    <TableCards cardType={state.cardType} cards={tableCards} startingPlayerIndex={state.startingPlayerIndex} playerSeating={state.playerSeating}></TableCards>
                    <Trumpf mode={state.mode} color={state.color} cardType={state.cardType}></Trumpf>
                </div>
                <PlayerCards cards={playerCards} cardType={state.cardType} state={state.status}></PlayerCards>
                {(() => {
                    if (state.status === GameStore.GameState.REQUESTING_TRUMPF) {
                        return <RequestTrumpf isGeschoben={state.isGeschoben} cardType={state.cardType}></RequestTrumpf>;
                    }
                })()}
            </div>
        );
    }
});
