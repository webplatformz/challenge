'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import JassAppDispatcher from '../../../client/js/jassAppDispatcher';

import serverApi from '../../../client/js/communication/serverApi';

describe('serverApi', () => {
    describe('connect', () => {
        it('should connect to Server and register handleMessage/handleActions functions', () => {
            let webSocketSpy = sinon.spy();
            let registerSpy = sinon.stub(JassAppDispatcher, 'register');
            window.WebSocket = webSocketSpy;

            serverApi.connect();

            expect(webSocketSpy.calledWithNew()).to.equal(true);
            expect(webSocketSpy.calledWith('ws://' + window.location.host)).to.equal(true);
            expect(registerSpy.calledWith(serverApi.handleActionsFromUi)).to.equal(true);
        });
    });
});