'use strict';

export default {
    create (gameMode, cardColor) {
        return {
            mode: gameMode,
            trumpfColor: cardColor
        };
    }
};