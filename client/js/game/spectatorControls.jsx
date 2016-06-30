

import React from 'react';
import JassActions from '../jassActions';

export default React.createClass({

    handlePlayingSpeed(event) {
        JassActions.adjustSpectatorSpeed(event.target.value);
    },

    render() {
        return (
            <div id="spectatorControls">
                <img src="/images/rabbit.png" />
                <input id="playingSpeed" onChange={this.handlePlayingSpeed} type="range" min="50" max="1000" step="50" />
                <img src="/images/turtle.png" />
            </div>
        );
    }
});
