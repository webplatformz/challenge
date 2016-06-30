'use strict';

import React from 'react';
import JassAppStore from './jassAppStore.js';
import ErrorToast from './error/errorToast.jsx';
import GameSetup from './gameSetup/gameSetup.jsx';
import JassTable from './game/jassTable.jsx';
import TournamentTable from './tournament/tournamentTable.jsx';
import {SessionType} from '../../shared/session/sessionType.js';
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

    render: function () {
        this.state = this.state || JassAppStore.state;

        return (
            <div>
                <ErrorToast error={this.state.error} />
                <GameSetup />
                {(() => {
                    switch (this.state.sessionType) {
                    case SessionType.TOURNAMENT:
                        return <TournamentTable rankingTable={this.state.rankingTable} registryBots={this.state.registryBots} started={this.state.tournamentStarted} />;
                    default:
                        return <JassTable />;
                    }
                })()}
            </div>
        );
    }
});

export default JassApp;
