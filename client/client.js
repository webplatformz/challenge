'use strict';

import './js/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import JassApp from './js/jassApp.jsx';

/*jshint ignore:start */
ReactDOM.render(<JassApp />, document.getElementsByTagName('main')[0]);
/*jshint ignore:end */