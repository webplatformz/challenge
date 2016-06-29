'use strict';

import {expect} from 'chai';
import React from 'react';

import TestUtils from 'react-addons-test-utils';

import PlayerNames from '../../../client/js/game/playerNames.jsx';

describe('PlayerNames Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id', () => {
        let props = {
            chosenSession: 'testSessionName'
        };

        shallowRenderer.render(React.createElement(PlayerNames, props));

        shallowRenderer.render(React.createElement(PlayerNames));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('playerNames');
    });

    it('should render a player div for each given player with the id where he sits, no class and an image', () => {
        let props = {
                players: [
                    {
                        id: 'uuid-1',
                        name: 'Player 1',
                        seatId: 0
                    },
                    {
                        id: '1',
                        name: 'Waiting for player...',
                        seatId: 1,
                        isEmptyPlaceholder: true
                    }
                ],
                playerSeating: [
                    'top',
                    'right'
                ],
                chosenSession: 'testSessionName'
            };

        shallowRenderer.render(React.createElement(PlayerNames, props));
        let actual = shallowRenderer.getRenderOutput();

        let playerNameElements = actual.props.children;
        expect(playerNameElements[0].key).to.equal(props.players[0].id);
        expect(playerNameElements[1].key).to.equal(props.players[1].id);
        expect(playerNameElements[0].props.id).to.equal('player-' + props.playerSeating[0]);
        expect(playerNameElements[0].props.className).to.equal('');
        expect(playerNameElements[0].props.children[0].props.className).to.equal('addBotIcon hidden');
        expect(playerNameElements[0].props.children[1]).to.equal(props.players[0].name);
        expect(playerNameElements[0].props.children[2].type).to.equal('object');
        expect(playerNameElements[1].key).to.equal(props.players[1].id);
        expect(playerNameElements[1].props.className).to.equal('');
        expect(playerNameElements[1].props.id).to.equal('player-' + props.playerSeating[1]);
        expect(playerNameElements[1].props.children[0].props.className).to.equal('addBotIcon');
        expect(playerNameElements[1].props.children[1]).to.equal(props.players[1].name);
        expect(playerNameElements[1].props.children[2].type).to.equal('object');
    });

    it('should set active class to player who made the last stich', () => {
        let props = {
            players: [
                {
                    id: 0,
                    name: 'Player 1'
                },
                {
                    id: 1,
                    name: 'Player 2'
                }
            ],
            playerSeating: [
                'top',
                'right'
            ],
            nextStartingPlayerIndex: 1
        };

        shallowRenderer.render(React.createElement(PlayerNames, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[1].props.className).to.equal('active');
    });

    it('should set round-player class to player who has to choose trumpf', () => {
        let props = {
            players: [
                {
                    id: 0,
                    name: 'Player 1'
                },
                {
                    id: 1,
                    name: 'Player 2'
                }
            ],
            playerSeating: [
                'top',
                'right'
            ],
            nextStartingPlayerIndex: 1,
            roundPlayerIndex: 1
        };

        shallowRenderer.render(React.createElement(PlayerNames, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[1].props.className).to.equal('active round-player');
    });

});