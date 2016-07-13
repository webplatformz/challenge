import React from 'react';
import {GameSetupStep} from '../reducers/gameSetup';
import ServerApi from '../communication/serverApi';

const RequestPlayerName = ({step}) => {

    function validatedAndChoosePlayerName(event) {
        let inputElement = event.target,
            playerName = inputElement.value;

        if (event.charCode === 13 && playerName.trim()) {
            inputElement.disabled = true;
            ServerApi.sendChoosePlayerNameMessage(playerName);
        }
    }

    return (
        <div id="requestPlayerName" className={(step === GameSetupStep.SET_PLAYER_NAME ? '' : 'hidden')}>
            <input type="text" placeholder="Enter Player Name..." onKeyPress={validatedAndChoosePlayerName}/>
        </div>
    );
};

RequestPlayerName.propTypes = {
    step: React.PropTypes.oneOf(Object.keys(GameSetupStep))
};

export default RequestPlayerName;

