'use strict';

import React from 'react';
import JassActions from '../jassActions.js';
import GameSetupStore from './gameSetupStore.js';

export default React.createClass({
    choosePlayerName: function (event) {
        let inputElement = event.target,
            playerName = inputElement.value;

        if (event.charCode === 13 && playerName.trim()) {
            inputElement.disabled = true;
            JassActions.choosePlayerName(playerName);
        }
    },

    render: function () {
        return (
            <div id="requestPlayerName" className={(this.props.setupState === GameSetupStore.GameSetupState.SET_PLAYER_NAME ? '' : 'hidden')}>
                <input type="text" placeholder="Enter Player Name..." onKeyPress={this.choosePlayerName}></input>
            </div>
        )
    }
});