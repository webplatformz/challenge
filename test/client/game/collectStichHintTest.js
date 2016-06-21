'use strict';

import {expect} from 'chai';
import React from 'react';

import TestUtils from 'react-addons-test-utils';

import CollectStichHint from '../../../client/js/game/collectStichHint.jsx';
import JassActions from '../../../client/js/jassActions';


describe('CollectStichHint Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should have an JassActions.collectStich clickhandler', () => {
        shallowRenderer.render(React.createElement(CollectStichHint));
        let actual = shallowRenderer.getRenderOutput();
        expect(actual.props.onClick).to.equal(JassActions.collectStich)
    });

});