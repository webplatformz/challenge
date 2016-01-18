'use strict';

import {expect} from 'chai';
import React from 'react/addons';
import sinon from 'sinon';
import JassActions from '../../../client/js/jassActions';

const TestUtils = React.addons.TestUtils;

import SpectatorControls from '../../../client/js/game/spectatorControls.jsx';

describe('SpectatorControls Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id', () => {
        shallowRenderer.render(React.createElement(SpectatorControls));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual.props.id).to.equal('spectatorControls');
    });

    it('should render a range slider with onChangeHandler', () => {
        shallowRenderer.render(React.createElement(SpectatorControls));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.props.children[1].type).to.equal('input');
        expect(actual.props.children[1].props.type).to.equal('range');
        expect(actual.props.children[1].props.onChange.__reactBoundMethod).to.equal(SpectatorControls.prototype.handlePlayingSpeed);
    });

    describe('handlePlayingSpeed', () => {

        let adjustSpectatorSpeedSpy;

        beforeEach(() => {
            adjustSpectatorSpeedSpy = sinon.spy(JassActions, 'adjustSpectatorSpeed');
        });

        afterEach(() => {
            JassActions.adjustSpectatorSpeed.restore();
        });

        it('should read input value and start action', () => {
            let eventDummy = {
                target: {
                    value: 150
                }
            };

            shallowRenderer.render(React.createElement(SpectatorControls));
            let actual = shallowRenderer.getRenderOutput();

            actual.props.children[1].props.onChange(eventDummy);
            expect(adjustSpectatorSpeedSpy.withArgs(eventDummy.target.value).calledOnce).to.equal(true);
        });
    });

});