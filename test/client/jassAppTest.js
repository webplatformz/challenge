'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import ErrorToast from '../../client/js/error/errorToast.jsx';
import GameSetup from '../../client/js/gameSetup/gameSetup.jsx';
import JassTable from '../../client/js/game/jassTable.jsx';
import JassAppStore from '../../client/js/jassAppStore.js';

const TestUtils = React.addons.TestUtils;

import JassApp from '../../client/js/jassApp.jsx';

describe('JassApp Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a main element with children ErrorToast, GameSetup and JassTable', () => {
        shallowRenderer.render(React.createElement(JassApp));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('main');
        expect(actual._store.props.children[0].type).to.equal(ErrorToast);
        expect(actual._store.props.children[1].type).to.equal(GameSetup);
        expect(actual._store.props.children[2].type).to.equal(JassTable);
    });

    it('should pass error State to ErrorToast', () => {
        JassAppStore.state.error = 'someError';

        shallowRenderer.render(React.createElement(JassApp));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual._store.props.children[0]._store.props.error).to.equal(JassAppStore.state.error);
    });

});