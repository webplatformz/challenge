import React from 'react';
import {GameSetupState} from './gameSetupStore';
import JassActions from '../jassActions';

export default React.createClass({

    addBot(sessionName, chosenTeamIndex) {
        JassActions.joinBot(sessionName, chosenTeamIndex);
    },

    render() {
        let status = this.props.setupState.status;
        let chosenSession = this.props.setupState.chosenSession || {};
        return (
            <div id="waitForPlayers"
              className={(status !== GameSetupState.WAIT_FOR_PLAYERS ? 'hidden' : '')}
            >

                <h1 className="jumbotron">Joining Session {chosenSession.sessionName}</h1>

                <h2 className="jumbotron">Waiting for players ... </h2>

                <div className="addBots">
                    <button type="button" onClick={() => this.addBot(chosenSession.sessionName, 0)}>Add Bot to Team 1</button>
                    <button type="button" onClick={() => this.addBot(chosenSession.sessionName, 1)}>Add Bot to Team 2</button>
                </div>

            </div>
        );
    }

});
