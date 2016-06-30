import request from 'request';
import EnvironmentUtil from './environmentUtil';

const Registry = {

    getRegisteredBots() {
        return new Promise((resolve, reject) => {
            request(EnvironmentUtil.getRegistryAddress(), (error, response, body) => {
                if (error) {
                    return reject(error);
                }

                let registeredBots = body;
                resolve(registeredBots);
            });
        });
    },

    /**
     *
     * @param bot
     * @param mode SessionType
     * @returns {Promise}
     */
    addBot(bot, mode) {
        return new Promise((resolve, reject) => {
            request.post({ url: EnvironmentUtil.getRegistryAddress() + '/addBot', json: true, body: {
                botId: bot.id,
                mode: mode,
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