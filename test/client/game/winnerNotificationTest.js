import {expect} from 'chai';
import React from 'react';

import TestUtils from 'react-addons-test-utils';

import WinnerNotification from '../../../client/js/game/winnerNotification.jsx';

describe('WinnerNotification Component', () => {

    const shallowRenderer = TestUtils.createRenderer();
    const props = {
        teams: [
            {
                name: 'Team 1',
                points: 100,
                players: [
                    { name: 'Player 1' },
                    { name: 'Player 3' },
                ],
            },
            {
                name: 'Team 2',
                points: 200,
                winner: true,
                players: [
                    { name: 'Player 2' },
                    { name: 'Player 4' },
                ],
            },
        ],
    };

    it('should render player names in title with given teams', () => {
        shallowRenderer.render(React.createElement(WinnerNotification, props));
        let actual = shallowRenderer.getRenderOutput();

        const titleElement = actual.props.children.props.children[0].props.children;
        expect(titleElement.type).to.equal('h3');
        expect(titleElement.props.children).to.eql(['Player 2 & Player 4', ' win!']);
    });

    it('should render team names in body title with given teams', () => {
        shallowRenderer.render(React.createElement(WinnerNotification, props));
        let actual = shallowRenderer.getRenderOutput();

        const titleTeam1Element = actual.props.children.props.children[1].props.children[0];
        expect(titleTeam1Element.type).to.equal('h3');
        expect(titleTeam1Element.props.children[0]).to.equal('Team 1');
        expect(titleTeam1Element.props.children[2].props.children).to.equal('Player 1 & Player 3');

        const titleTeam2Element = actual.props.children.props.children[1].props.children[2];
        expect(titleTeam2Element.type).to.equal('h3');
        expect(titleTeam2Element.props.children[0]).to.equal('Team 2');
        expect(titleTeam2Element.props.children[2].props.children).to.equal('Player 2 & Player 4');
    });

    it('should render points in body of given teams', () => {
        shallowRenderer.render(React.createElement(WinnerNotification, props));
        let actual = shallowRenderer.getRenderOutput();

        const titleTeam1Element = actual.props.children.props.children[1].props.children[1];
        expect(titleTeam1Element.type).to.equal('p');
        expect(titleTeam1Element.props.children).to.eql([100, ' Points']);

        const titleTeam2Element = actual.props.children.props.children[1].props.children[3];
        expect(titleTeam2Element.type).to.equal('p');
        expect(titleTeam2Element.props.children).to.eql([200, ' Points']);
    });

});