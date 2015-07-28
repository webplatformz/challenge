'uset strict';

let React = require('react'),
    GameSetupStore = require('./gameSetupStore');

module.exports = React.createClass({
    render: function () {
        return (
            <div id="connecting" className={(this.props.setupState !== GameSetupStore.GameSetupState.CHOOSE_SESSION ? 'hidden' : '')}>
                <h1>Choose Session</h1>
            </div>
        )
    }
});