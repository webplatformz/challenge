'use strict';

let React = require('react');

module.exports = React.createClass({
    render: function() {
        return <span>asdf</span>;
    }
});

React.render(<JassApp />, document.getElementsByTagName('main')[0]);
