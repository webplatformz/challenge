import React from 'react';

export default React.createClass({

    rankingDataAvailable: false,
    showRankings: false,

    enableRankings() {
        this.showRankings = true;
        this.forceUpdate();
    },

    componentWillReceiveProps(nextProps) {
        function hasRank(player) {
            return player.rank
        }

        if(nextProps.ranking.length > 0 && nextProps.ranking.some(hasRank)) {
            this.rankingDataAvailable = true;
        }
    },


    render() {
        if (this.props.gameStarted && !this.rankingDataAvailable) {
            return (<p>Game in progress...</p>);
        } else if(this.rankingDataAvailable && !this.showRankings) {
            return (<button type="button" name="enableRankings" onClick={this.enableRankings}>Show ranking table</button>);
        } else {
            return (
                <table>
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Connected Clients</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.ranking.map((player) => (
                        <tr key={player.playerName}>
                            <td>{player.rank}</td>
                            <td>{player.playerName}</td>
                            <td>{player.connectedClients}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        }

    }
});
