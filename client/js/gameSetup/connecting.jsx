'use strict';

import React from 'react';
import GameSetupStore from './gameSetupStore.js';

export default React.createClass({
    render: function () {
        return (
            <div id="connecting" className={(this.props.setupState !== GameSetupStore.GameSetupState.CONNECTING ? 'hidden' : '')}>
                <h1 className="jumbotron">Connecting to Server...</h1>
            </div>
        )
    }
});