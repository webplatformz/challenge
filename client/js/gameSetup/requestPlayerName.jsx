'use strict';

let React = require('react'),
    JassActions = require('../jassActions'),
    GameSetupStore = require('./gameSetupStore');

module.exports = React.createClass({
    choosePlayerName: function (event) {
        let inputElement = event.target,
            playerName = inputElement.value;

        if (event.charCode === 13 && playerName) {
            inputElement.disabled = true;
            JassActions.choosePlayerName(playerName);
        }
    },

    render: function () {
        return (
            <div id="requestPlayerName">
                <input placeholder="Enter Player Name..." onKeyPress={this.choosePlayerName}></input>
            </div>
        )
    }
});