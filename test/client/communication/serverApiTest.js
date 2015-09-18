'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    JassAppDispatcher = require('../../../client/js/jassAppDispatcher');

describe('serverApi', () => {

    let serverApi = require('../../../client/js/communication/serverApi');

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