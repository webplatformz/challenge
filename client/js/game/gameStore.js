import {EventEmitter} from 'events';
import JassAppDispatcher from '../jassAppDispatcher';
import JassAppConstants from '../jassAppConstants';
import * as Card from '../../../shared/deck/card';

export const GameState = {
    WAITING: 'WAITING',
    SESSION_STARTED: 'SESSION_STARTED',
    REQUESTING_TRUMPF: 'REQUESTING_TRUMPF',
    TRUMPF_CHOSEN: 'TRUMPF_CHOSEN',
    REQUESTING_CARD: 'REQUESTING_CARD',
    REJECTED_CARD: 'REJECTED_CARD',
    REQUESTING_CARDS_FROM_OTHER_PLAYERS: 'REQUESTING_CARDS_FROM_OTHER_PLAYERS',
    STICH: 'STICH'
};

export const CardType = {
    FRENCH: 'french',
    GERMAN: 'german'
};

export const PlayerType = {
    PLAYER: 'PLAYER',
    SPECTATOR: 'SPECTATOR'
};

function emptyPlayer(emptyPlayerId) {
    return {
        id: emptyPlayerId.toString(),
        seatId: emptyPlayerId,
        name: 'Waiting for player...',
        isEmptyPlaceholder: true
    };
}

const emptyPlayersTable = [emptyPlayer(0), emptyPlayer(1), emptyPlayer(2), emptyPlayer(3)];

let player,
    spectatorEventQueue = [],
    spectatorRenderingIntervall = 500;

const GameStore = Object.assign(Object.create(EventEmitter.prototype), {
    state: {
        playerType: PlayerType.PLAYER,
        cardType: localStorage.getItem('cardType') || CardType.FRENCH,
        players: [],
        teams: [],
        playerSeating: ['bottom', 'right', 'top', 'left'],
        tableCards: [],
        playerCards: [],
        startingPlayerIndex: 0,
        nextStartingPlayerIndex: 0,
        roundPlayerIndex: 0,
        cyclesMade: 0,
        status: GameState.WAITING,
        collectStich: true,
        showLastStich: false,
        showPoints: false,
        lastStichCards: [],
        lastStichStartingPlayerIndex: undefined
    },

    addChangeListener(callback) {
        this.on('change', callback);
    },

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    },

    spectatorRendering() {
        const payload = spectatorEventQueue.shift();
        if (payload) {
            this.handlePayload(payload);
            if (payload.action.actionType === JassAppConstants.BROADCAST_GAME_FINISHED) {
                return;
            }
        }
        setTimeout(this.spectatorRendering.bind(this), spectatorRenderingIntervall);
    },
    handleAction(payload) {
        if (payload.source === JassAppDispatcher.Source.SERVER_ACTION && this.state.playerType === PlayerType.SPECTATOR) {
            spectatorEventQueue.push(payload);
        } else {
            this.handlePayload(payload);
        }
    },
    handlePayload(payload) {
        let action = payload.action;
        switch (action.actionType) {
            case JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR:
                this.state.playerType = PlayerType.SPECTATOR;
                this.spectatorRendering();
                this.emit('change');
                break;
            case JassAppConstants.ADJUST_SPECTATOR_SPEED:
                spectatorRenderingIntervall = action.data;
                break;
            case JassAppConstants.SESSION_JOINED:
                let playerSeating = this.state.playerSeating,
                    playerIndex;

                if (!player) {
                    player = action.data.player;
                    playerIndex = player.seatId;
                }
                this.state.chosenSession = action.data.sessionName;

                this.state.players = emptyPlayersTable.map(player => {
                    return action.data.playersInSession.find(p => p.seatId === player.seatId) || player;
                });

                this.state.playerSeating = playerSeating.concat(playerSeating.splice(0, 4 - playerIndex));
                this.emit('change');
                break;
            case JassAppConstants.BROADCAST_TEAMS:
                this.state.status = GameState.SESSION_STARTED;
                this.state.teams = action.data;
                this.emit('change');
                break;
            case JassAppConstants.DEAL_CARDS:
                this.state.playerCards = action.data.map(Card.createFromObject);
                this.emit('change');
                break;
            case JassAppConstants.REQUEST_TRUMPF:
                this.state.status = GameState.REQUESTING_TRUMPF;
                this.state.isGeschoben = action.data;
                this.emit('change');
                break;
            case JassAppConstants.CHOOSE_TRUMPF:
                this.state.status = GameState.TRUMPF_CHOSEN;
                this.state.tableCards = [];
                this.emit('change');
                break;
            case JassAppConstants.BROADCAST_TRUMPF:
                this.state.status = GameState.TRUMPF_CHOSEN;
                this.state.mode = action.data.mode;
                this.state.color = action.data.trumpfColor;
                this.emit('change');
                break;
            case JassAppConstants.CHANGE_CARD_TYPE:
                this.state.cardType = action.data;
                localStorage.setItem('cardType', action.data);
                this.emit('change');
                break;
            case JassAppConstants.REQUEST_CARD:
                this.state.status = GameState.REQUESTING_CARD;
                this.emit('change');
                break;
            case JassAppConstants.CHOOSE_CARD:
                let chosenCard = Card.createFromObject(action.data);
                this.state.playerCards = this.state.playerCards.filter((card) => {
                    return !card.equals(chosenCard);
                });
                this.emit('change');
                break;
            case JassAppConstants.REJECT_CARD:
                let rejectedCard = Card.createFromObject(action.data);
                this.state.status = GameState.REJECTED_CARD;
                this.state.playerCards.push(rejectedCard);
                this.emit('change');
                break;
            case JassAppConstants.PLAYED_CARDS:
                this.state.startingPlayerIndex = this.state.nextStartingPlayerIndex;
                this.state.status = GameState.REQUESTING_CARDS_FROM_OTHER_PLAYERS;
                if (action.data) {
                    this.state.tableCards = action.data.map(Card.createFromObject);
                }
                this.emit('change');
                break;
            case JassAppConstants.BROADCAST_STICH:
                let playerId = action.data.id,
                    teams = action.data.teams;
                this.state.lastStichCards = action.data.playedCards;
                this.state.lastStichStartingPlayerIndex = this.state.nextStartingPlayerIndex;
                this.state.status = GameState.STICH;
                this.state.cyclesMade++;

                if (this.state.cyclesMade === 9) {
                    this.state.cyclesMade = 0;
                    this.state.roundPlayerIndex = ++this.state.roundPlayerIndex % 4;
                    this.state.nextStartingPlayerIndex = this.state.roundPlayerIndex;
                } else {
                    this.state.players.every((player, index) => {
                        if (player.id === playerId) {
                            this.state.nextStartingPlayerIndex = index;
                            return false;
                        }

                        return true;
                    });
                }

                teams.forEach((team) => {
                    this.state.teams.forEach((stateTeam) => {
                        if (stateTeam.name === team.name) {
                            stateTeam.points = team.points;
                            stateTeam.currentRoundPoints = team.currentRoundPoints;
                        }
                    });
                });

                this.emit('change');
                this.state.collectStich = false;
                this.state.tableCards = [];
                break;
            case JassAppConstants.BROADCAST_GAME_FINISHED:
                this.state.mode = undefined;
                this.state.color = undefined;
                this.emit('change');
                break;
            case JassAppConstants.COLLECT_STICH:
                this.state.collectStich = true;
                this.emit('change');
                break;
            case JassAppConstants.TOGGLE_SHOW_LAST_STICH:
                this.state.showLastStich = !this.state.showLastStich;
                this.emit('change');
                break;
            case JassAppConstants.TOGGLE_SHOW_POINTS:
                this.state.showPoints = !this.state.showPoints;
                this.emit('change');
                break;
            case JassAppConstants.BROADCAST_WINNER_TEAM:
                this.state.teams.find(team => team.name === action.data.name).winner = true;
                this.emit('change');
                break;
        }
    }

});

JassAppDispatcher.register((payload) => GameStore.handleAction(payload));

export default GameStore;
