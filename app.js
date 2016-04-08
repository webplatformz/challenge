'use strict';

import express from 'express';
import * as Server from './server/server';

const port = process.env.PORT || 3000;
let app = express();

app.use(express.static(__dirname + '/build/client'));

Server.start(port, app);