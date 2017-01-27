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
                <RankingTable ranking={state.rankingTable.ranking} gameStarted={state.tournamentStarted} />
                
                <h1 className="jumbotron">Pairing Results</h1>
                <PairingsTable pairings={state.rankingTable.pairingResults} />
                
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
