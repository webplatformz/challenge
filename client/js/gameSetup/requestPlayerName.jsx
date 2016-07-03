import React from 'react';
import JassActions from '../jassActions';
import {GameSetupStep} from '../reducers/gameSetup';

function choosePlayerName(event) {
    let inputElement = event.target,
        playerName = inputElement.value;

    if (event.charCode === 13 && playerName.trim()) {
        inputElement.disabled = true;
        JassActions.choosePlayerName(playerName);
    }
}

const RequestPlayerName = ({step}) => {
    return (
        <div id="requestPlayerName" className={(step === GameSetupStep.SET_PLAYER_NAME ? '' : 'hidden')}>
            <input type="text" placeholder="Enter Player Name..." onKeyPress={choosePlayerName}/>
        </div>
    );
};

RequestPlayerName.propTypes = {
    step: React.PropTypes.oneOf(Object.keys(GameSetupStep))
};

export default RequestPlayerName;

