'use strict';

import {expect} from 'chai';
import React from 'react/addons';

const TestUtils = React.addons.TestUtils;

import SpectatorControls from '../../../client/js/game/spectatorControls.jsx';

describe('SpectatorControls Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(SpectatorControls));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('spectatorControls');
    });

    it('should render a range slider with onChangeHandler', () => {
        shallowRenderer.render(React.createElement(SpectatorControls));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual._store.props.children.type).to.equal('input');
        expect(actual._store.props.children._store.props.type).to.equal('range');
        expect(actual._store.props.children._store.props.onChange.__reactBoundMethod).to.equal(SpectatorControls.prototype.handlePlayingSpeed);
    });

});