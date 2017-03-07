import {expect} from 'chai';
import React from 'react';

import TestUtils from 'react-addons-test-utils';

import Points from '../../../client/js/game/points.jsx';
import JassActions from '../../../client/js/jassActions';
import sinon from 'sinon';

describe('Points Component', () => {

    let shallowRenderer = TestUtils.createRenderer();

    let toggleSpy;

    beforeEach(() => {
        toggleSpy = sinon.spy(JassActions, 'toggleShowPoints');
    });

    afterEach(() => {
        JassActions.toggleShowPoints.restore();
    });

    it('should render a div with id, no class and onclick handler', () => {
        let props = {
            teams: []
        };

        shallowRenderer.render(React.createElement(Points, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('points');
        expect(actual.props.className).to.equal('');
        expect(actual.props.onClick.__reactBoundMethod).to.equal(Points.prototype.toggleShown);
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
                    points: 25,
                    winner: true
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

        let teams = actual.props.children;
        let team1Title = teams[0].props.children[1].props.children;
        let team1CurrentPoints = teams[0].props.children[2].props.children;
        let team1TotalPoints = teams[0].props.children[3].props.children;
        expect(teams[0].props.children[0].type).to.equal('img');
        expect(teams[0].key).to.equal(props.teams[0].name);
        expect(team1Title[0]).to.equal(props.teams[0].name);
        expect(team1CurrentPoints[1]).to.equal(props.teams[0].currentRoundPoints);
        expect(team1TotalPoints[1]).to.equal(props.teams[0].points);
        let team2Title = teams[1].props.children[1].props.children;
        let team2CurrentPoints = teams[1].props.children[2].props.children;
        let team2TotalPoints = teams[1].props.children[3].props.children;
        expect(teams[1].props.children[0]).to.be.undefined;
        expect(teams[1].key).to.equal(props.teams[1].name);
        expect(team2Title[0]).to.equal(props.teams[1].name);
        expect(team2CurrentPoints[1]).to.equal(props.teams[1].currentRoundPoints);
        expect(team2TotalPoints[1]).to.equal(props.teams[1].points);
    });

    it('should toggle display onclick', () => {
        let props = {
            teams: []
        };

        shallowRenderer.render(React.createElement(Points, props));
        let actual = shallowRenderer.getRenderOutput();

        const elementClick = actual.props.onClick;
        expect(elementClick).to.be.a('function');
        elementClick();
        sinon.assert.calledOnce(toggleSpy);
    });
});