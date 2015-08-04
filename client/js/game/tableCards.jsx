'use strict';

let React = require('react');

module.exports = React.createClass({

    render: function () {
        let cards = this.props.cards || [];

        return (
            <div id="tableCards">
                <div className="card-top">
                    <img src="/images/cards/french/clubs_6.gif" />
                </div>
                <div className="card-right">
                    <img src="/images/cards/french/clubs_7.gif" />
                </div>
                <div className="card-bottom">
                    <img src="/images/cards/french/clubs_10.gif" />
                </div>
                <div className="card-left">
                    <img src="/images/cards/french/clubs_14.gif" />
                </div>
            </div>
        );
    }
});
