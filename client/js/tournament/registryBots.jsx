import React from 'react';
import JassActions from '../jassActions';

export default ({bots = [], sessionName, isSpectator}) => {
    return (
        <div id="registryBots" className={isSpectator ? '' : 'hidden'}>
            {(() => {
                if (bots.length) {
                    return (
                        <div>
                            <h1>Add Bots from Registry</h1>
                            <table>
                                <thead>
                                <tr>
                                    <th>Owner</th>
                                    <th />
                                </tr>
                                </thead>
                                <tbody>
                                {bots.map(bot => (
                                        <tr key={bot.id}>
                                            <td>{bot.owner}</td>
                                            <td>
                                                <a onClick={() => JassActions.addBotFromRegistry(bot, sessionName)}>
                                                    Add
                                                </a>
                                                <i className="fa fa-bolt" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                } else {
                    return <p>There are no bots available in the registry.</p>
                }
            })()}
        </div>
    );
};
