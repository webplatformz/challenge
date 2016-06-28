'use strict';

import request from 'request';

let registryUrl = 'http://localhost:1338/api';

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
    }

};

export default Registry;