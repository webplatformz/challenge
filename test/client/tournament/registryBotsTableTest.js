import {expect} from 'chai';
import React from 'react';
import sinon from 'sinon';

import TestUtils from 'react-addons-test-utils';

import RegistryBotsTable from '../../../client/js/tournament/registryBotsTable.jsx';
import JassActions from '../../../client/js/jassActions';

describe('RegistryBotsTable', () => {

    let shallowRenderer = TestUtils.createRenderer(),
        addBotFromRegistrySpy = sinon.spy(JassActions, 'addBotFromRegistry');

    it('should render table with bots', () => {
        const props = {
            bots: [
                {
                    id: '1',
                    owner: 'Dani'
                },
                {
                    id: '2',
                    owner: 'Nick'
                }

            ]
        };

        shallowRenderer.render(React.createElement(RegistryBotsTable, props));
        let actual = shallowRenderer.getRenderOutput();

        let botsRows = actual.props.children.props.children[1].props.children;
        botsRows.forEach((botRow, index) => {
            let bot = props.bots[index];

            expect(botRow.key).to.equal(bot.id);
            expect(botRow.props.children[0].props.children).to.equal(bot.owner);

            let addBotFromRegistryAnchor = botRow.props.children[1].props.children;
            addBotFromRegistryAnchor.props.onClick();
            sinon.assert.calledWith(addBotFromRegistrySpy, bot);
        });
    });

    it('should display a hint instead of the table when there are no bots', () => {
        const props = { bots : []};
        let actual = shallowRenderer.render(React.createElement(RegistryBotsTable, props));

        let noBotsHint = actual.props.children;
        expect(noBotsHint.props.children).to.equal('There are no bots available in the registry.');
    });
    
});