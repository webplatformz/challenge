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
                <div className="request-trumpf-dialog">
                    <div onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.HEARTS)}>H</div>
                    <div onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.DIAMONDS)}>D</div>
                    <div onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.CLUBS)}>C</div>
                    <div onClick={this.chooseTrumpf.bind(null, GameMode.TRUMPF, CardColor.SPADES)}>S</div>
                    <div onClick={this.chooseTrumpf.bind(null, GameMode.UNDEUFE, undefined)}>U</div>
                    <div onClick={this.chooseTrumpf.bind(null, GameMode.OBEABE, undefined)}>O</div>
                    {((component) => {
                        if (!component.props.isGeschoben) {
                            return <div onClick={component.chooseTrumpf.bind(null, GameMode.SCHIEBE, undefined)}>Sc</div>;
                        }
                    })(this)}
                </div>
            </div>
        );
    }
});
