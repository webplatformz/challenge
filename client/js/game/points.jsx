import React from 'react';
import JassActions from '../jassActions';

export default (props) => {

    return (
        <div id="points"
             className={(props.showPoints) ? 'shown' : ''}
             onClick={() => JassActions.toggleShowPoints()}
        >
            {props.teams.map((team) => {
                return (
                    <div key={team.name}>
                        <h3>
                            {team.name} {(() => {
                            if (props.showPoints) {
                                return (
                                    <small>({team.players[0].name} & {team.players[1].name})</small>
                                );
                            }
                        })()}
                        </h3>
                        <div className="current-round-points">
                            {(props.showPoints) ? 'Current Round: ' : ''}{team.currentRoundPoints}
                        </div>
                        <div className="total-points">
                            {(props.showPoints) ? 'Total: ' : ''}{team.points}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
