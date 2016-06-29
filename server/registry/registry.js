'use strict';

import request from 'request';

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
            request.post({ url: registryUrl + '/addBot', json: true, body: {
                wsUrl: wsUrl,
                botId: bot.id,
                mode: 'TOURNAMENT | SINGLE',
                sessionName: 'sessionName'
            }}, (err, res, body) => {
                if (err) {
                    return reject();
                }
                resolve();
            });
        });


    }

};

export default Registry;