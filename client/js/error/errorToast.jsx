'use strict';

let React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div id="errorToast" className={(this.props.error) ? 'in' : 'out'}>
                <span>{String(this.props.error)}</span>
            </div>
        )
    }
});