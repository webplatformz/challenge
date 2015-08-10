'use strict';

let React = require('react');

module.exports = React.createClass({

    handlePlayingSpeed: function() {
        //TODO add handling of range change
    },

    render: function() {
        return (
            <div id="spectatorControls">
                <input id="playingSpeed" onChange={this.handlePlayingSpeed} type="range" min="50" max="1000" step="50" value="500"/>
            </div>
        );
    }
});
