'use strict';

import {create as createJassBot} from '../../bot/JassBot';
import nameGenerator from 'docker-namesgenerator';

export function startRandomBot({url, sessionName, chosenTeamIndex}) {
    createJassBot(nameGenerator(), url, sessionName, chosenTeamIndex);
}