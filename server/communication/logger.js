'use strict';

let debug = Boolean(process.env.DEBUG) || false;

const Logger = {
    debug (messageToLog) {
        if (debug){
            console.log(messageToLog);
        }
    },

    error (messageToLog) {
        console.error(messageToLog);
    }
};

export default Logger;