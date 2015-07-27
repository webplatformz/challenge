'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    JassAppDispatcher = require('../../../client/js/jassAppDispatcher');

describe('serverApi', () => {
    describe('initialization', () => {
        it('should connect to Server and register handleMessage/handleActions functions', () => {
            window.WebSocket = function () {};
            let webSocket = sinon.spy(window, 'WebSocket');
            let registerSpy = sinon.spy(JassAppDispatcher, 'register');

            let serverApi = require('../../../client/js/communication/serverApi');

            expect(webSocket.calledWithNew()).to.equal(true);
            expect(webSocket.calledWith('ws://' + window.location.host)).to.equal(true);
            expect(registerSpy.calledWith(serverApi.handleActionsFromUi)).to.equal(true);
        });
    });
});