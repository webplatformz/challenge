'use strict';

import request from 'request';
var http = require('http')

let registryUrl = 'http://172.16.37.113:1338/api';

const Registry = {

    getRegisteredBots() {
        return new Promise((resolve, reject) => {
            request(registryUrl, (error, response, body) => {
                if (error) {
                    return reject(error);
                }

                let registeredBots = body;
                resolve(registeredBots);
            });
        });
    },

    addBot(bot, wsUrl) {
        return new Promise((resolve, reject) => {
            request.post({ url: registryUrl + '/addBot', json: true, body: { wsUrl: wsUrl, botId: bot.id }}, (err, res, body) => {
                resolve();
            });
        });


    }

};

export default Registry;