'use strict';

let React = require('react');

module.exports = React.createClass({

    render: function () {
        let cards = this.props.cards || [];

        return (
            <div id="tableCards">

            </div>
        );
    }
});
