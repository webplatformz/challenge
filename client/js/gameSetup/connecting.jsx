import React from 'react';
import {GameSetupState} from './gameSetupStore';

export default React.createClass({
    render() {
        return (
            <div id="connecting" className={(this.props.setupState !== GameSetupState.CONNECTING ? 'hidden' : '')}>
                <h1 className="jumbotron">Connecting to Server...</h1>
            </div>
        );
    }
});
