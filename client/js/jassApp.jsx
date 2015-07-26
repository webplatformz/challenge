'use strict';

let React = require('react');

let JassApp = React.createClass({
    render: function() {
        return (
            <div id="title">
                <span>Jass Challenge</span>
            </div>
        );
    }
});

React.render(<JassApp />, document.getElementById('jassApp'));
