'use strict';

let React = require('react'),
    GameStore = require('./gameStore');

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
            playerSeating = state.playerSeating;

        return (
            <div id="jassTable">
                <div id="jassCarpet">
                    {players.map(function(player, index) {
                        return (
                            <div key={player.id} id={'player-' + playerSeating[index]}>
                                {player.name}
                            </div>);
                    })}
                    <div className="card-top">
                        <img src="/images/cards/french/clubs_6.gif" />
                    </div>
                    <div className="card-right">
                        <img src="/images/cards/french/clubs_7.gif" />
                    </div>
                    <div className="card-bottom">
                        <img src="/images/cards/french/clubs_10.gif" />
                    </div>
                    <div className="card-left">
                        <img src="/images/cards/french/clubs_14.gif" />
                    </div>
                </div>
                <div id="playerCards"></div>
            </div>
        );
    }
});
