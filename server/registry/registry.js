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
     * @param sessionName
     * @returns {Promise}
     */
    addBot(bot, mode, sessionName) {
        return new Promise((resolve, reject) => {
            const addBotRequest = {
                botId: bot.id,
                serverUrl: EnvironmentUtil.getPublicServerAddress(),
                mode: mode,
                sessionName: sessionName
            };

            request.post({
                url: EnvironmentUtil.getRegistryAddress() + '/addBot',
                json: true,
                body: addBotRequest
            }, (err, res, body) => {
                if (err) {
                    return reject();
                }
                resolve();
            });
        });


    }

};

export default Registry;