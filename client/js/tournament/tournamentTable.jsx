import React from 'react';
import JassActions from '../jassActions';
import RegistryBots from './registryBots.jsx';
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
        const {rankingTable, registryBots, tournamentStarted} = this.state || TournamentStore.state;

        return (
            <div id="tournamentTable">
                <RegistryBots bots={registryBots} />
                
                <h1 className="jumbotron">Current rankings</h1>
                <RankingTable ranking={rankingTable.ranking} />
                
                <h1 className="jumbotron">Pairing Results</h1>
                <PairingsTable pairings={rankingTable.pairingResults} />
                
                {(() => {
                    if (!tournamentStarted) {
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
