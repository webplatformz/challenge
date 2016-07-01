import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import JassApp from './js/jassApp.jsx';
import {createStore} from 'redux'
import {Provider} from 'react-redux';
import reducers from './js/reducers/reducers';


const store = createStore(reducers);

ReactDOM.render(
    <Provider store={store}>
        <JassApp />
    </Provider>,
    document.getElementsByTagName('main')[0]
);
