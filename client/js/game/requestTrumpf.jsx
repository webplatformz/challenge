'use strict';

let React = require('react'),
    CardColor = require('../../../shared/deck/card').CardColor,
    GameMode = require('../../../shared/game/gameMode'),
    JassActions = require('../jassActions');

module.exports = React.createClass({

    chooseTrumpf: function(mode, color) {
        JassActions.chooseTrumpf(mode, color);
    },

    render: function () {
        return (
            <div id="requestTrumpf">
                <img onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.HEARTS)} src="/images/trumpf/french/hearts.png" />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.DIAMONDS)} src="/images/trumpf/french/diamonds.png" />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.CLUBS)} src="/images/trumpf/french/clubs.png" />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.SPADES)} src="/images/trumpf/french/spades.png" />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.UNDEUFE, undefined)} src="/images/trumpf/undeufe.jpg" />
                <img onClick={this.chooseTrumpf.bind(null, GameMode.OBEABE, undefined)} src="/images/trumpf/obeabe.jpg" />
                {((component) => {
                    if (!component.props.isGeschoben) {
                        return <img onClick={component.chooseTrumpf.bind(null, GameMode.SCHIEBE, undefined)} src="/images/trumpf/schiebe.jpg" />;
                    }
                })(this)}
            </div>
        );
    }
});
