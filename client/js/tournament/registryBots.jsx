import React from 'react';
import JassActions from '../jassActions';

export default React.createClass({

    addBotFromRegistry(bot) {
        JassActions.addBotFromRegistry(bot);
    },

    render() {
        let bots = this.props.bots || [];

        return (
            <div id="registryBots">
                {(() => {
                    if (bots.length) {
                        return (
                            <div>
                                <h1>Add Bots from Registry</h1>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Owner</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {bots.map(bot => {
                                        return (
                                            <tr key={bot.id}>
                                                <td>{bot.owner}</td>
                                                <td>
                                                    <a href="javascript:void(0)"
                                                       onClick={() => this.addBotFromRegistry(bot)}
                                                    >
                                                    Add
                                                </a>
                                                    <i className="fa fa-bolt"></i>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )
                    } else {
                        return <p>There are no bots available in the registry.</p>
                    }
                })()
                }

            </div>
        );
    }

});
