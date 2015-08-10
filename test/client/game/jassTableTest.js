'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import GameStore from '../../../client/js/game/gameStore';
import CardTypeSwitcher from '../../../client/js/game/cardTypeSwitcher.jsx';
import JassCarpet from '../../../client/js/game/jassCarpet.jsx';
import PlayerCards from '../../../client/js/game/playerCards.jsx';
import RequestTrumpf from '../../../client/js/game/requestTrumpf.jsx';
import SpectatorControls from '../../../client/js/game/spectatorControls.jsx';

const TestUtils = React.addons.TestUtils;

import JassTable from '../../../client/js/game/jassTable.jsx';

describe('JassTable Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('jassTable');
    });

    it('should render children when player', () => {
        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual._store.props.children;
        expect(children.length).to.equal(5);
        expect(children[0].type).to.equal(CardTypeSwitcher);
        expect(children[1].type).to.equal(JassCarpet);
        expect(children[2].type).to.equal(PlayerCards);
        expect(children[3]).to.equal(undefined);
        expect(children[4]).to.equal(undefined);
    });

    it('should render children when spectator', () => {
        GameStore.state.playerType = GameStore.PlayerType.SPECTATOR;
        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let children = actual._store.props.children;
        expect(children.length).to.equal(5);
        expect(children[0].type).to.equal(CardTypeSwitcher);
        expect(children[1].type).to.equal(JassCarpet);
        expect(children[2]).to.equal(undefined);
        expect(children[3]).to.equal(undefined);
        expect(children[4].type).to.equal(SpectatorControls);
    });

    it('should pass correct properties to JassCarpet', () => {
        GameStore.state.cardType = GameStore.CardType.GERMAN;
        GameStore.state.players = ['player1'];
        GameStore.state.playerSeating = ['playerSeating'];
        GameStore.state.tableCards = ['card'];
        GameStore.state.startingPlayerIndex = 1;
        GameStore.state.mode = 'mode';
        GameStore.state.color = 'color';


        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let jassCarpet = actual._store.props.children[1];
        expect(jassCarpet._store.props.cardType).to.equal(GameStore.state.cardType);
        expect(jassCarpet._store.props.players).to.eql(GameStore.state.players);
        expect(jassCarpet._store.props.playerSeating).to.eql(GameStore.state.playerSeating);
        expect(jassCarpet._store.props.cards).to.eql(GameStore.state.tableCards);
        expect(jassCarpet._store.props.startingPlayerIndex).to.equal(GameStore.state.startingPlayerIndex);
        expect(jassCarpet._store.props.mode).to.equal(GameStore.state.mode);
        expect(jassCarpet._store.props.color).to.equal(GameStore.state.color);
    });


    it('should pass correct properties to PlayerCards', () => {
        GameStore.state.playerType = GameStore.PlayerType.PLAYER;
        GameStore.state.playerCards = ['card1', 'card2'];
        GameStore.state.cardType = GameStore.CardType.FRENCH;
        GameStore.state.status = GameStore.GameState.REQUESTING_CARD;

        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let playerCards = actual._store.props.children[2];
        expect(playerCards._store.props.cards).to.eql(GameStore.state.playerCards);
        expect(playerCards._store.props.cardType).to.equal(GameStore.state.cardType);
        expect(playerCards._store.props.state).to.equal(GameStore.state.status);
    });

    it('should pass correct properties to RequestTrumpf', () => {
        GameStore.state.isGeschoben = true;
        GameStore.state.cardType = GameStore.CardType.FRENCH;
        GameStore.state.status = GameStore.GameState.REQUESTING_TRUMPF;

        shallowRenderer.render(React.createElement(JassTable));
        let actual = shallowRenderer.getRenderOutput();

        let requestTrumpf = actual._store.props.children[3];
        expect(requestTrumpf._store.props.isGeschoben).to.equal(GameStore.state.isGeschoben);
        expect(requestTrumpf._store.props.cardType).to.equal(GameStore.state.cardType);
    });
});