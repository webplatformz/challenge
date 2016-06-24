'use strict';

import React from 'react';
import GameSetupStore from './gameSetupStore.js';

export default React.createClass({


    addBot(chosenTeamIndex) {
        // TODO
    },

    render: function () {
        let status = this.props.setupState.status;
        let chosenSession = this.props.setupState.chosenSession || {};
        return (
            <div id="waitForPlayers"
                 className={(status !== GameSetupStore.GameSetupState.WAIT_FOR_PLAYERS ? 'hidden' : '')}>

                <h1 className="jumbotron">Joining Session {chosenSession.sessionName} ...</h1>

                <h2 className="jumbotron">Waiting for players ... </h2>

                <div className="addBots">

                    <h3 className="jumbotron">Add Bot Players</h3>

                    <button type="button" onClick={() => this.addBot(0)}>Add Bot to Team 1</button>
                    <button type="button" onClick={() => this.addBot(1)}>Add Bot to Team 2</button>
                    <button type="button" onClick={() => this.addBot()}>Add Bot to Any Team</button>
                </div>

            </div>
        );
    }

});