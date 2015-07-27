'use strict';

let React = require('react');
let RequestPlayerName = require('./gameSetup/requestPlayerName.jsx');

let JassApp = React.createClass({
    render: function() {
        return (<RequestPlayerName />);
    }
});

React.render(<JassApp />, document.getElementById('jassApp'));
