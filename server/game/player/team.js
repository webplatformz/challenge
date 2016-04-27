'use strict';

export function create(name) {
    return {
        name,
        points: 0,
        currentRoundPoints: 0
    };
}