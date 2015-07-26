'use strict';

let expect = require('chai').expect,
    sinon = require('sinon');

describe('serverApi', () => {
    describe('initialization', () => {
        it('should connect to Server and register handlMessage function', () => {
            let dummyWebSocket = function () {};
            window.WebSocket = dummyWebSocket;
            let webSocket = sinon.spy(window, 'WebSocket');

            let serverApi = require('../../../client/js/communication/serverApi');

            expect(webSocket.calledWithNew()).to.equal(true);
            expect(webSocket.calledWith('ws://' + window.location.host)).to.equal(true);
        });
    });
});