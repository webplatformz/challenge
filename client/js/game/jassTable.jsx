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
            players = state.players || [];

        return (
            <div id="jassTable">
                JassTable
            </div>
        );
    }
});
