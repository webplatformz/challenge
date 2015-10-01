'use strict';

let React = require('react'),
    RequestPlayerName = require('./requestPlayerName.jsx'),
    Connecting = require('./connecting.jsx'),
    ChooseSession = require('./chooseSession.jsx'),
    CreateTournament = require('./../tournament/createTournament.jsx'),
    GameSetupStore = require('./gameSetupStore');

function getSetupStateClassName(setupState) {
    if (setupState.status === GameSetupStore.GameSetupState.FINISHED) {
        return 'finished';
    }
}

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
            <div id="gameSetup" className={getSetupStateClassName(this.state)}>
                <Connecting setupState={this.state.status} />
                <RequestPlayerName setupState={this.state.status} />
                <ChooseSession setupState={this.state} />
            </div>
        );
    }
});
