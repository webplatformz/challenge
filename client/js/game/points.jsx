'use strict';

let React = require('react');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            shown: false
        };
    },

    toggleShown: function() {
        this.setState({
            shown: !this.state.shown
        });
    },

    render: function () {
        return (
            <div id="points" className={(this.state.shown) ? 'shown' : ''} onClick={this.toggleShown}>
                {this.props.teams.map((team) => {
                    return (
                        <div key={team.name}>
                            <h3>
                                {team.name} {(function(team) {
                                    if (this.state.shown) {
                                        return (
                                            <small>({team.players[0].name} & {team.players[1].name})</small>
                                        );
                                    }
                                }.bind(this))(team)}
                            </h3>
                            <div className="current-round-points">
                                {(this.state.shown) ? 'Current Round: ' : ''}{team.currentRoundPoints}
                            </div>
                            <div className="total-points">
                                {(this.state.shown) ? 'Total: ' : ''}{team.points}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
});
