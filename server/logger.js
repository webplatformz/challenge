/*eslint no-console: 0*/


let debug = Boolean(process.env.DEBUG) || false;

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