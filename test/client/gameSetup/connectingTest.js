'use strict';

import {expect} from 'chai';
import React from 'react';
import GameSetupStore from '../../../client/js/gameSetup/gameSetupStore';

import TestUtils from 'react-addons-test-utils';

import Connecting from '../../../client/js/gameSetup/connecting.jsx';

describe('Connecting Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id connecting className hidden and a title child', () => {
        shallowRenderer.render(React.createElement(Connecting));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('connecting');
        expect(actual.props.className).to.equal('hidden');
        expect(actual.props.children.type).to.equal('h1');
    });

    it('should remove className hidden when GameSetupState CONNECTING', () => {
        shallowRenderer.render(React.createElement(Connecting, { setupState: GameSetupStore.GameSetupState.CONNECTING }));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.className).to.equal('');
    });

});