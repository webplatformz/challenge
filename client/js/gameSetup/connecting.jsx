import React from 'react';
import {GameSetupState} from './gameSetupStore';

export default (props) => {
    return (
        <div id="connecting" className={(props.setupState !== GameSetupState.CONNECTING ? 'hidden' : '')}>
            <h1 className="jumbotron">Connecting to Server...</h1>
        </div>
    );
};
