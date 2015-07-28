'use strict';

let React = require('react'),
    GameSetup = require('./gameSetup/gameSetup.jsx'),
    serverApi = require('./communication/serverApi');

let JassApp = React.createClass({
    render: function() {
        return (
            <GameSetup />
        );
    }
});

React.render(<JassApp />, document.getElementById('jassApp'));
