'use strict';

let React = require('react');

module.exports = React.createClass({
    render: function () {
        let error = this.props.error || '';

        return (
            <div id="errorToast" className={(this.props.error) ? 'in' : 'out'}>
                <span>{String(error)}</span>
            </div>
        )
    }
});