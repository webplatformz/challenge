'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import {CardType} from '../../../client/js/game/gameStore';
import JassActions from '../../../client/js/jassActions';

const TestUtils = React.addons.TestUtils;

import PlayerNames from '../../../client/js/game/playerNames.jsx';

describe('PlayerNames Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(PlayerNames));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('playerNames');
    });

    it('should render a player div for each given player with the id where he sits, no class and an image', () => {
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
                ]
            };

        shallowRenderer.render(React.createElement(PlayerNames, props));
        let actual = shallowRenderer.getRenderOutput();

        let playerNameElements = actual._store.props.children;
        expect(Number(playerNameElements[0].key)).to.equal(props.players[0].id);
        expect(playerNameElements[0]._store.props.id).to.equal('player-' + props.playerSeating[0]);
        expect(playerNameElements[0]._store.props.className).to.equal('');
        expect(playerNameElements[0]._store.props.children[0]).to.equal(props.players[0].name);
        expect(playerNameElements[0]._store.props.children[1].type).to.equal('object');
        expect(Number(playerNameElements[1].key)).to.equal(props.players[1].id);
        expect(playerNameElements[1]._store.props.className).to.equal('');
        expect(playerNameElements[1]._store.props.id).to.equal('player-' + props.playerSeating[1]);
        expect(playerNameElements[1]._store.props.children[0]).to.equal(props.players[1].name);
        expect(playerNameElements[1]._store.props.children[1].type).to.equal('object');
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

        expect(actual._store.props.children[1]._store.props.className).to.equal('active');
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

        expect(actual._store.props.children[1]._store.props.className).to.equal('active round-player');
    });

});