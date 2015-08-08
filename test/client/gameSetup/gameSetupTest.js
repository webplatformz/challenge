'use strict';

let expect = require('chai').expect,
    React = require('react/addons'),
    TestUtils = React.addons.TestUtils;

describe('JassApp Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    let GameSetup;

    beforeEach(() => {
        GameSetup = require('../../../client/js/gameSetup/gameSetup.jsx');
    });

    it('should render a div element with id gameSetup', () => {
        shallowRenderer.render(React.createElement(GameSetup));

        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('gameSetup');
    });
});