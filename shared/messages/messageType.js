'use strict';

import {SessionChoice} from '../session/sessionChoice.js';
import {GameMode} from '../game/gameMode.js';
import {CardColor} from '../deck/cardColor';
import {SessionType} from '../session/sessionType.js';

export const MessageType = {
    REQUEST_PLAYER_NAME: {
        name: 'REQUEST_PLAYER_NAME'
    },
    CHOOSE_PLAYER_NAME: {
        name: 'CHOOSE_PLAYER_NAME',
        constraints: {
            'type': {
                presence: true
            },
            'data': {
                presence: true,
                length: {
                    minimum: 1
                }
            }
        }
    },
    BROADCAST_TEAMS: {
        name: 'BROADCAST_TEAMS'
    },
    DEAL_CARDS: {
        name: 'DEAL_CARDS'
    },
    REQUEST_TRUMPF: {
        name: 'REQUEST_TRUMPF'
    },
    CHOOSE_TRUMPF: {
        name: 'CHOOSE_TRUMPF',
        constraints: {
            'type': {
                presence: true
            },
            'data.mode': {
                presence: true,
                inclusion: {
                    within: GameMode
                }
            },
            'data.trumpfColor': {
                inclusion: {
                    within: CardColor
                }
            }
        }
    },
    REJECT_TRUMPF: {
        name: 'REJECT_TRUMPF'
    },
    BROADCAST_TRUMPF: {
        name: 'BROADCAST_TRUMPF'
    },
    BROADCAST_STICH: {
        name: 'BROADCAST_STICH'
    },
    BROADCAST_WINNER_TEAM: {
        name: 'BROADCAST_WINNER_TEAM'
    },
    BROADCAST_GAME_FINISHED: {
        name: 'BROADCAST_GAME_FINISHED'
    },
    PLAYED_CARDS: {
        name: 'PLAYED_CARDS'
    },
    REQUEST_CARD: {
        name: 'REQUEST_CARD'
    },
    CHOOSE_CARD: {
        name: 'CHOOSE_CARD',
        constraints: {
            'type': {
                presence: true
            },
            'data.number': {
                presence: true,
                inclusion: {
                    within: [6,7,8,9,10,11,12,13,14]
                }
            },
            'data.color': {
                presence: true,
                inclusion: {
                    within: CardColor
                }
            }
        }
    },
    REJECT_CARD: {
        name: 'REJECT_CARD'
    },
    REQUEST_SESSION_CHOICE: {
        name: 'REQUEST_SESSION_CHOICE'
    },
    CHOOSE_SESSION: {
        name: 'CHOOSE_SESSION',
        constraints: {
            'type': {
                presence: true
            },
            'data.sessionChoice': {
                presence: true,
                inclusion: {
                    within: SessionChoice
                }
            },
            'data.sessionName': {
                length: {
                    minimum: 1
                }
            },
            'data.sessionType': {
                inclusion: {
                    within: SessionType
                }
            },
            'data.chosenTeamIndex': {
                inclusion: {
                    within: [0, 1]
                }
            },
            'data.asSpectator': {
                presence: false
            }
        }
    },
    SESSION_JOINED: {
        name: 'SESSION_JOINED'
    },
    BROADCAST_SESSION_JOINED: {
        name: 'BROADCAST_SESSION_JOINED'
    },
    BAD_MESSAGE: {
        name: 'BAD_MESSAGE'
    },
    BROADCAST_TOURNAMENT_RANKING_TABLE: {
        name: 'BROADCAST_TOURNAMENT_RANKING_TABLE'
    },
    START_TOURNAMENT: {
        name: 'START_TOURNAMENT',
        constraints: {
            'type': {
                presence: true
            }
        }
    },
    BROADCAST_TOURNAMENT_STARTED: {
        name: 'BROADCAST_TOURNAMENT_STARTED'
    },
    JOIN_BOT: {
        name: 'JOIN_BOT',
        constraints: {
            'type': {
                presence: true
            },
            'data.sessionName': {
                presence: true
            },
            'data.chosenTeamIndex': {
                presence: true,
                inclusion: {
                    within: [0, 1]
                }
            }
        }
    }
};