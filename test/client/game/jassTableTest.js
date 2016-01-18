'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import {default as GameStore, CardType, GameState, PlayerType} from '../../../client/js/game/gameStore';
import CardTypeSwitcher from '../../../client/js/game/cardTypeSwitcher.jsx';
import JassCarpet from '../../../client/js/game/jassCarpet.jsx';
import Points from '../../../client/js/game/points.jsx';
import PlayerCards from '../../../client/js/game/playerCards.jsx';
import RequestTrumpf from '../../../client/js/game/requestTrumpf.jsx';
import SpectatorControls from '../../../client/js/game/spectatorControls.jsx';

const TestUtils = React.addons.TestUtils;

import JassTable from '../../../client/js/game/jassTable.jsx';

describe('JassTable Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    let initialGameState;

    beforeEach(() => {
        initialGameState = GameStore.state;
    });

    afterEach(() => {
        GameStore.state = initialGameState;
    });

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('jassTable');
    });

    it('should render children when player', () => {
        GameStore.state.playerType = PlayerType.PLAYER;

        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children;
        expect(children.length).to.equal(6);
        expect(children[0].type).to.equal(CardTypeSwitcher);
        expect(children[1].type).to.equal(JassCarpet);
        expect(children[2].type).to.equal(Points);
        expect(children[3].type).to.equal(PlayerCards);
        expect(children[4]).to.equal(undefined);
        expect(children[5]).to.equal(undefined);
    });

    it('should render children when spectator', () => {
        GameStore.state.playerType = PlayerType.SPECTATOR;

        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual.props.children;
        expect(children.length).to.equal(6);
        expect(children[0].type).to.equal(CardTypeSwitcher);
        expect(children[1].type).to.equal(JassCarpet);
        expect(children[2].type).to.equal(Points);
        expect(children[3]).to.equal(undefined);
        expect(children[4]).to.equal(undefined);
        expect(children[5].type).to.equal(SpectatorControls);
    });

    it('should pass correct properties to JassCarpet', () => {
        GameStore.state.cardType = CardType.GERMAN;
        GameStore.state.players = ['player1'];
        GameStore.state.playerSeating = ['playerSeating'];
        GameStore.state.tableCards = ['card'];
        GameStore.state.startingPlayerIndex = 1;
        GameStore.state.nextStartingPlayerIndex = 2;
        GameStore.state.mode = 'mode';
        GameStore.state.color = 'color';
        GameStore.state.roundPlayerIndex = 0;


        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let jassCarpet = actual.props.children[1];
        expect(jassCarpet.props.cardType).to.equal(GameStore.state.cardType);
        expect(jassCarpet.props.players).to.eql(GameStore.state.players);
        expect(jassCarpet.props.playerSeating).to.eql(GameStore.state.playerSeating);
        expect(jassCarpet.props.cards).to.eql(GameStore.state.tableCards);
        expect(jassCarpet.props.startingPlayerIndex).to.equal(GameStore.state.startingPlayerIndex);
        expect(jassCarpet.props.nextStartingPlayerIndex).to.equal(GameStore.state.nextStartingPlayerIndex);
        expect(jassCarpet.props.mode).to.equal(GameStore.state.mode);
        expect(jassCarpet.props.color).to.equal(GameStore.state.color);
        expect(jassCarpet.props.roundPlayerIndex).to.equal(GameStore.state.roundPlayerIndex);
    });

    it('should pass correct properties to Points', () => {
        GameStore.state.teams = [
            {
                name: 'Team 1'
            },
            {
                name: 'Team 2'
            }
        ];


        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let points = actual.props.children[2];
        expect(points.props.teams).to.equal(GameStore.state.teams);
    });

    it('should pass correct properties to PlayerCards', () => {
        GameStore.state.playerType = PlayerType.PLAYER;
        GameStore.state.playerCards = ['card1', 'card2'];
        GameStore.state.cardType = CardType.FRENCH;
        GameStore.state.status = GameState.REQUESTING_CARD;

        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let playerCards = actual.props.children[3];
        expect(playerCards.props.cards).to.eql(GameStore.state.playerCards);
        expect(playerCards.props.cardType).to.equal(GameStore.state.cardType);
        expect(playerCards.props.state).to.equal(GameStore.state.status);
    });

    it('should pass correct properties to RequestTrumpf', () => {
        GameStore.state.isGeschoben = true;
        GameStore.state.cardType = CardType.FRENCH;
        GameStore.state.status = GameState.REQUESTING_TRUMPF;

        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let requestTrumpf = actual.props.children[4];
        expect(requestTrumpf.props.isGeschoben).to.equal(GameStore.state.isGeschoben);
        expect(requestTrumpf.props.cardType).to.equal(GameStore.state.cardType);
    });
});