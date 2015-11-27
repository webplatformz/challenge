'use strict';

export default {
    create(name) {
        return {
            name,
            points: 0,
            currentRoundPoints: 0
        };
    }
};