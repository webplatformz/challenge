'use strict';

let React = require('react'),
    RequestPlayerName = require('./requestPlayerName.jsx'),
    Connecting = require('./connecting.jsx'),
    GameSetupStore = require('./gameSetupStore');

module.exports = React.createClass({

    handleGameSetupState: function () {
        this.setState(GameSetupStore.state);
    },

    componentDidMount: function () {
        GameSetupStore.addChangeListener(this.handleGameSetupState);
    },

    componentWillUnmount: function () {
        GameSetupStore.removeChangeListener(this.handleGameSetupState);
    },

    render: function () {
        this.state = GameSetupStore.state;

        return (
            <div id="gameSetup">
                <Connecting setupState={this.state.status} />
                <RequestPlayerName setupState={this.state.status} />
            </div>
        );
    }
});
