import React from 'react';
import JassActions from '../jassActions';

export default () => {
    return (
        <div id="spectatorControls">
            <img src="/images/rabbit.png"/>
            <input id="playingSpeed"
                   onChange={(event) => JassActions.adjustSpectatorSpeed(event.target.value)}
                   type="range"
                   min="50"
                   max="1000"
                   step="50"
            />
            <img src="/images/turtle.png"/>
        </div>
    );
};
