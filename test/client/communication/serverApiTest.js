

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

            sinon.assert.calledWith(webSocketSpy, `ws://${window.location.host}`);
            sinon.assert.calledWith(registerSpy, serverApi.handleActionsFromUi);
        });
    });
});