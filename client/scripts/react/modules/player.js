'use strict';

let React = require('react');

module.exports = React.createClass({
    render: function() {
        let elementId = 'player' + this.props.id;
        return <div id={elementId}></div>;
    }
});