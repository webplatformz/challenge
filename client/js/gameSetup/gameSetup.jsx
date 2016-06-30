import React from 'react';
import RequestPlayerName from './requestPlayerName.jsx';
import Connecting from './connecting.jsx';
import ChooseSession from './chooseSession.jsx';
import ChooseTeam from './chooseTeam.jsx';
import {default as GameSetupStore, GameSetupState} from './gameSetupStore';

function getSetupStateClassName(setupState) {
    if (setupState.status === GameSetupState.FINISHED
        || setupState.status === GameSetupState.WAIT_FOR_PLAYERS) {
        return 'finished';
    }
}

export default React.createClass({

    handleGameSetupState() {
        this.setState(GameSetupStore.state);
    },

    componentDidMount() {
        GameSetupStore.addChangeListener(this.handleGameSetupState);
    },

    componentWillUnmount() {
        GameSetupStore.removeChangeListener(this.handleGameSetupState);
    },

    render() {
        this.state = GameSetupStore.state;

        return (
            <div id="gameSetup" className={getSetupStateClassName(this.state)}>
                <Connecting setupState={this.state.status} />
                <RequestPlayerName setupState={this.state.status} />
                <ChooseSession setupState={this.state} />
                <ChooseTeam setupState={this.state} />
            </div>
        );
    }
});
