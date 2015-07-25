'use strict';

let React = require('react');
let JassApp = require('./react/modules/jassApp');
let ServerApi = require('./react/communication/serverApi');


React.render(<JassApp />, document.getElementsByTagName('main')[0]);