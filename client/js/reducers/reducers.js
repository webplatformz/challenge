import {combineReducers} from 'redux';
import tournament from './tournament';
import jassApp from './jassApp';
import gameSetup from './gameSetup';
import singleGame from './singleGame';

export default combineReducers({
    gameSetup,
    jassApp,
    tournament,
    singleGame
});
