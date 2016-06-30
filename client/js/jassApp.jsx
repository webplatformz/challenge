import React from 'react';
import JassAppStore from './jassAppStore';
import ErrorToast from './error/errorToast.jsx';
import GameSetup from './gameSetup/gameSetup.jsx';
import JassTable from './game/jassTable.jsx';
import TournamentTable from './tournament/tournamentTable.jsx';
import {SessionType} from '../../shared/session/sessionType';
import serverApi from './communication/serverApi';

const JassApp = React.createClass({

    handleJassAppState() {
        this.setState(JassAppStore.state);
    },

    componentDidMount() {
        serverApi.connect();
        JassAppStore.addChangeListener(this.handleJassAppState);
    },

    componentWillUnmount() {
        JassAppStore.removeChangeListener(this.handleJassAppState);
    },

    render() {
        this.state = this.state || JassAppStore.state;

        return (
            <div>
                <ErrorToast error={this.state.error} />
                <GameSetup />
                {(() => {
                    switch (this.state.sessionType) {
                    case SessionType.TOURNAMENT:
                        return <TournamentTable />;
                    default:
                        return <JassTable />;
                    }
                })()}
            </div>
        );
    }
});

export default JassApp;
