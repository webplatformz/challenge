'use strict';

import React from 'react';
import GameSetupStore from './gameSetupStore.js';

export default React.createClass({

    render: function () {
        let status = this.props.setupState.status;
        let chosenSession = this.props.setupState.chosenSession;
        if (status == GameSetupStore.GameSetupState.WAIT_FOR_PLAYERS) {
            return (
                <div id="waitForPlayers"
                     className={(status !== GameSetupStore.GameSetupState.WAIT_FOR_PLAYERS ? 'hidden' : '')}>

                    <h1 className="jumbotron">Joining Session {chosenSession.sessionName} ...</h1>

                    <h2 className="jumbotron">Waiting for players ... </h2>

                </div>
            )
        } else {
            return (<div></div>)
        }
    }

});