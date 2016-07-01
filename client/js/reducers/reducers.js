import {combineReducers} from 'redux';
import tournament from './tournament';
import jassApp from './jassApp';

export default combineReducers({
    jassApp,
    tournament
});
