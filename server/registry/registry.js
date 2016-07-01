import request from 'request';
import EnvironmentUtil from './environmentUtil';

const Registry = {

    getRegisteredBots() {
        return new Promise((resolve, reject) => {
            request(EnvironmentUtil.getRegistryAddress(), (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    },

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
            }, (error) => {
                if (error) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }

};

export default Registry;