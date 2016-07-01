import express from 'express';
import * as Server from './server/server';
import EnvironmentUtil from './server/registry/environmentUtil';

const app = express();

app.use(express.static(__dirname + '/build/client'));

Server.start(EnvironmentUtil.getPort(), app);