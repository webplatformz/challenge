'use strict';

let React = require('react'),
    JassAppStore = require('./jassAppStore'),
    ErrorToast = require('./error/errorToast.jsx'),
    GameSetup = require('./gameSetup/gameSetup.jsx'),
    JassTable = require('./game/jassTable.jsx'),
    serverApi = require('./communication/serverApi');

let JassApp = React.createClass({

    handleJassAppState: function () {
        this.setState(JassAppStore.state);
    },

    componentDidMount: function () {
        serverApi.connect();
        JassAppStore.addChangeListener(this.handleJassAppState);
    },

    componentWillUnmount: function () {
        JassAppStore.removeChangeListener(this.handleJassAppState);
    },

    render: function() {
        this.state = this.state || {};

        return (
            <main>
                <ErrorToast error={this.state.error} />
                <GameSetup />
                <JassTable />
            </main>
        );
    }
});

module.exports = JassApp;