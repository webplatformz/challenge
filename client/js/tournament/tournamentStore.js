import {EventEmitter} from 'events';
import JassAppDispatcher from '../jassAppDispatcher';
import JassAppConstants from '../jassAppConstants';

const TournamentStore = Object.assign(Object.create(EventEmitter.prototype), {
    state: {
        isSpectator: false,
        ranking: [],
        joinedClients: [],
        pairingResults: [],
        registryBots: [],
        tournamentStarted: false,
        rankingDisplayed: false
    },

    addChangeListener(callback) {
        this.on('change', callback);
    },

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    },

    handleAction({action}) {
        switch (action.actionType) {
            case JassAppConstants.CREATE_NEW_SESSION:
            case JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR:
                this.state.isSpectator = true;
                this.state.sessionName = action.data.sessionName;
                break;
            case JassAppConstants.BROADCAST_TOURNAMENT_RANKING_TABLE:
                if (this.state.tournamentStarted) {
                    let rankingsAvailable = action.data.ranking.some(player => player.rank);
                    if (rankingsAvailable) {
                        this.state.ranking = action.data.ranking;
                    }
                    this.state.pairingResults = action.data.pairingResults;
                } else {
                    this.state.joinedClients = action.data.ranking;
                }
                this.emit('change');
                break;
            case JassAppConstants.BROADCAST_TOURNAMENT_STARTED:
                this.state.tournamentStarted = true;
                this.emit('change');
                break;
            case JassAppConstants.SEND_REGISTRY_BOTS:
                this.state.registryBots = JSON.parse(action.data);
                this.emit('change');
                break;
            case JassAppConstants.SHOW_RANKING_TABLE:
                this.state.rankingDisplayed = true;
                this.emit('change');
                break;
        }
    }

});

JassAppDispatcher.register((payload) => TournamentStore.handleAction(payload));

export default TournamentStore;
