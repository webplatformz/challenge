'use strict';

import React from 'react';
import JassActions from '../jassActions.js';

export default React.createClass({

    addBotFromRegistry(bot) {
        JassActions.addBotFromRegistry(bot);
    },

    render() {
        let bots = this.props.bots || [];

        return (
            <div id="registryBots">
                <table>
                    <thead>
                        <tr>
                            <th>Owner</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {console.log(typeof bots)}
                    {bots.map(bot => {
                       return (
                         <tr key={bot.id}>
                             <td>{bot.owner}</td>
                             <td><a href="javascript:void(0)"
                                    onClick={() => this.addBotFromRegistry(bot)}>Add</a></td>
                         </tr>
                       );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }

});
