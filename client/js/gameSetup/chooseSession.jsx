'uset strict';

let React = require('react'),
    GameSetupStore = require('./gameSetupStore');

module.exports = React.createClass({
    render: function () {
        let status = this.props.setupState.status,
            sessions = this.props.setupState.sessions || [];

        return (
            <div id="chooseSession" className={(status !== GameSetupStore.GameSetupState.CHOOSE_SESSION ? 'hidden' : '')}>
                <h1 className="jumbotron">Choose Session</h1>
                <form>
                    <select name="existingSession">
                        {sessions.map(function(session) {
                            return <li value={session}>{session}</li>;
                        })}
                    </select>
                </form>
            </div>
        )
    }
});