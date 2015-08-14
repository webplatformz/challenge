'use strict';

import {expect} from 'chai';
import React from 'react/addons';

const TestUtils = React.addons.TestUtils;

import Points from '../../../client/js/game/points.jsx';

describe('Points Component', () => {

    let shallowRenderer = TestUtils.createRenderer();

    it('should render a div with id, no class and onclick handler', () => {
        let props = {
            teams: []
        };

        shallowRenderer.render(React.createElement(Points, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('points');
        expect(actual._store.props.className).to.equal('');
        expect(actual._store.props.onClick.__reactBoundMethod).to.equal(Points.prototype.toggleShown);
    });

    it('should render teams and players with points', () => {
        let props = {
            teams: [
                {
                    name: 'Team 1',
                    players: [
                        {
                            name: 'Player 1'
                        },
                        {
                            name: 'Player 3'
                        }
                    ],
                    currentRoundPoints: 50,
                    points: 25
                },
                {
                    name: 'Team 2',
                    players: [
                        {
                            name: 'Player 2'
                        },
                        {
                            name: 'Player 4'
                        }
                    ],
                    currentRoundPoints: 0,
                    points: 15
                }
            ]
        };

        shallowRenderer.render(React.createElement(Points, props));
        let actual = shallowRenderer.getRenderOutput();

        let teams = actual._store.props.children;
        let team1Title = teams[0]._store.props.children[0]._store.props.children;
        let team1CurrentPoints = teams[0]._store.props.children[1]._store.props.children;
        let team1TotalPoints = teams[0]._store.props.children[2]._store.props.children;
        expect(teams[0].key).to.equal(props.teams[0].name);
        expect(team1Title[0]).to.equal(props.teams[0].name);
        expect(team1CurrentPoints[1]).to.equal(props.teams[0].currentRoundPoints);
        expect(team1TotalPoints[1]).to.equal(props.teams[0].points);
        let team2Title = teams[1]._store.props.children[0]._store.props.children;
        let team2CurrentPoints = teams[1]._store.props.children[1]._store.props.children;
        let team2TotalPoints = teams[1]._store.props.children[2]._store.props.children;
        expect(teams[1].key).to.equal(props.teams[1].name);
        expect(team2Title[0]).to.equal(props.teams[1].name);
        expect(team2CurrentPoints[1]).to.equal(props.teams[1].currentRoundPoints);
        expect(team2TotalPoints[1]).to.equal(props.teams[1].points);
    });
});