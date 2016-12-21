/*eslint no-console: 0*/

const debug = Boolean(process.env.DEBUG);

export const Logger = {
    debug (messageToLog) {
        if (debug){
            console.log(messageToLog);
        }
    },

    error (messageToLog) {
        console.error(messageToLog);
    },

    info (messageToLog) {
        console.info(messageToLog);
    }
};