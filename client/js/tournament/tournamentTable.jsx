import React from 'react';
import JassActions from '../jassActions';
import RegistryBotsTable from './registryBotsTable.jsx';
import RankingTable from './rankingTable.jsx';
import PairingsTable from './pairingsTable.jsx';
import TournamentStore from './tournamentStore';


export default React.createClass({

    handleGameSetupState() {
        this.setState(TournamentStore.state);
    },

    componentDidMount() {
        TournamentStore.addChangeListener(this.handleGameSetupState);
        setTimeout(JassActions.requestRegistryBots);
    },

    componentWillUnmount() {
        TournamentStore.removeChangeListener(this.handleGameSetupState);
    },

    render() {
        const state = this.state || TournamentStore.state;
        return (
            <div id="tournamentTable">
                <h1>Add Bots from Registry</h1>
                <RegistryBotsTable
                    bots={state.registryBots}
                    sessionName={state.sessionName}
                    isSpectator={state.isSpectator}
                />
                
                <h1 className="jumbotron">Current rankings</h1>

                {(() => {
                    if (state.tournamentStarted && state.rankingDisplayed) {
                        return <RankingTable ranking={state.ranking}/>;
                    } else if (!state.tournamentStarted) {
                        return <RankingTable ranking={state.joinedClients}/>;
                    } else if (state.tournamentStarted && state.ranking.length === 0) {
                        return <p>Game in progress...</p>;
                    } else if (state.tournamentStarted && state.ranking.length > 0) {
                        return (
                            <button type="button" name="enableRankings" onClick={JassActions.showRankingTable}>
                                Show ranking table
                            </button>
                        );
                    }
                })()}

                <h1 className="jumbotron">Pairing Results</h1>
                <PairingsTable pairings={state.pairingResults} />

                {(() => {
                    if (!state.tournamentStarted) {
                        return (
                            <button type="button" name="startTournament" onClick={JassActions.startTournament}>
                                Start!
                            </button>
                        );
                    }
                })()}
            </div>
        );
    }
});
