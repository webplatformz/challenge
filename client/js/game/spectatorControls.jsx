'use strict';

import React from 'react';
import JassActions from '../jassActions';

module.exports = React.createClass({

    handlePlayingSpeed: function(event) {
        JassActions.adjustSpectatorSpeed(event.target.value);
    },

    render: function() {
        return (
            <div id="spectatorControls">
                <input id="playingSpeed" onChange={this.handlePlayingSpeed} type="range" min="50" max="1000" step="50" value="500"/>
            </div>
        );
    }
});
