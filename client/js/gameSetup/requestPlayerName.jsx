import React from 'react';
import {GameSetupStep} from '../reducers/gameSetup';

const RequestPlayerName = ({step, choosePlayerName}) => {

    function validatedAndChoosePlayerName(event) {
        let inputElement = event.target,
            playerName = inputElement.value;

        if (event.charCode === 13 && playerName.trim()) {
            inputElement.disabled = true;
            choosePlayerName(playerName);
        }
    }

    return (
        <div id="requestPlayerName" className={(step === GameSetupStep.SET_PLAYER_NAME ? '' : 'hidden')}>
            <input type="text" placeholder="Enter Player Name..." onKeyPress={validatedAndChoosePlayerName}/>
        </div>
    );
};

RequestPlayerName.propTypes = {
    step: React.PropTypes.oneOf(Object.keys(GameSetupStep)),
    choosePlayerName: React.PropTypes.func
};

export default RequestPlayerName;

