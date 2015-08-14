'use strict';

import React from 'react';
import JassAppStore from './jassAppStore.js';
import ErrorToast from './error/errorToast.jsx';
import GameSetup from './gameSetup/gameSetup.jsx';
import JassTable from './game/jassTable.jsx';
import serverApi from './communication/serverApi';

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
        this.state = this.state || JassAppStore.state;

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