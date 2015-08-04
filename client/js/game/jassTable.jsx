'use strict';

let React = require('react'),
    GameStore = require('./gameStore'),
    PlayerCards = require('./playerCards.jsx'),
    TableCards = require('./tableCards.jsx'),
    PlayerNames = require('./playerNames.jsx');

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
            playerCards = state.playerCards;

        return (
            <div id="jassTable">
                <div id="jassCarpet">
                    <PlayerNames players={players} playerSeating={playerSeating}></PlayerNames>
                    <TableCards></TableCards>
                </div>
                <PlayerCards cards={playerCards}></PlayerCards>
            </div>
        );
    }
});
