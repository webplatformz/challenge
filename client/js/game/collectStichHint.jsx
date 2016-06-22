'use strict';

import React from 'react';
import JassActions from '../jassActions';


export default React.createClass({
    render() {
        return (
            <div id="collectStichHint" onClick={JassActions.collectStich}><p>Collect played cards</p></div>
        );
    }
});
