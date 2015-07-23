'use strict';

let React = require('react');
let Player = require('./player');

module.exports = React.createClass({
    render: function() {
        return (
            <div id="cardsPlayed">
                <Player id="0" />
                <Player id="1" />
                <Player id="2" />
                <Player id="3" />
            </div>);
    }
});