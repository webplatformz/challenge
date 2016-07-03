import React from 'react';
import {GameSetupStep} from '../reducers/gameSetup';


const Connecting = ({step}) => {
    return (
        <div id="connecting" className={(step !== GameSetupStep.CONNECTING ? 'hidden' : '')}>
            <h1 className="jumbotron">Connecting to Server...</h1>
        </div>
    );
};

Connecting.propTypes = {
    step: React.PropTypes.oneOf(Object.keys(GameSetupStep))
};

export default Connecting;