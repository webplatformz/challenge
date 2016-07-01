import React from 'react';
import ErrorToast from './error/errorToast.jsx';
import GameSetup from './gameSetup/gameSetup.jsx';
import JassTable from './game/jassTable.jsx';
import TournamentTable from './tournament/tournamentTable.jsx';
import {SessionType} from '../../shared/session/sessionType';
import serverApi from './communication/serverApi';
import {connect} from 'react-redux';

serverApi.connect();

const JassAppComponent = ({error, sessionType}) => {
    return (
        <div>
            <ErrorToast error={error}/>
            <GameSetup />
            {(() => {
                switch (sessionType) {
                    case SessionType.TOURNAMENT:
                        return <TournamentTable />;
                    case SessionType.SINGLE_GAME:
                        return <JassTable />;
                }
            })()}
        </div>
    );
};

JassAppComponent.propTypes = {
    error: React.PropTypes.string,
    sessionType: React.PropTypes.oneOf(Object.keys(SessionType))
};

const JassApp = connect(
    (state) => state.jassApp,
    () => {
        return {};
    }
)(JassAppComponent);

export default JassApp;
