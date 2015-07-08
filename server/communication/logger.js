'use strict';

let debug = Boolean(process.env.DEBUG) || false;

const Logger = {
    debug : function (messageToLog) {
        if (debug){
            console.log(messageToLog);
        }
    },
    error : function(messageToLog) {
        console.error(messageToLog);
    }
};

module.exports = Logger;