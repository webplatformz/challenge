'use strict';

import {expect} from 'chai';
import React from 'react/addons';

const TestUtils = React.addons.TestUtils;

import Points from '../../../client/js/game/points.jsx';

describe('Points Component', () => {

    let shallowRenderer = TestUtils.createRenderer();

    it('should render a div with id', () => {
        let props = {
            teams: []
        };

        shallowRenderer.render(React.createElement(Points, props));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('points');
    });
});