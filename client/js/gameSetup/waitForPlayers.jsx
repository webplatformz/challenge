'use strict';

import React from 'react';
import GameSetupStore from './gameSetupStore.js';

export default React.createClass({

    render: function () {
        let status = this.props.setupState.status;
        return (
                <div id="waitForPlayers" className={(status !== GameSetupStore.GameSetupState.WAIT_FOR_PLAYERS ? 'hidden' : '')}>

                    <h1 className="jumbotron">Waiting for players ... </h1>

                </div>
        )
    }

});