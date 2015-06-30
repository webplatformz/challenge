'use strict';

let clientCommunication = require('../../lib/communication/clientCommunication'),
    WebSocket = require('ws'),
    messages = require('../../lib/communication/messages'),
    expect = require('chai').expect,
    sinon = require('sinon');

describe('clientCommunication', () => {
    it('should convert message to JSON string', () => {
        let message = messages.create(messages.MessageType.REQUEST_TRUMPF, false);

        let actual = clientCommunication.toJSON(message);

        expect(actual).to.equal('{"type":"REQUEST_TRUMPF","data":{"pushed":false}}');
    });

    it('should convert JSON string to message', () => {
        let message = '{"type":"REQUEST_TRUMPF","data":{"pushed":false}}';

        let actual = clientCommunication.fromJSON(message);

        expect(actual.type).to.equal(messages.MessageType.REQUEST_TRUMPF);
        expect(actual.data).to.eql({pushed: false});
    });

    it('should broadcast message to all given clients', () => {
        let WebSocketStub = {
            send: function () {
            }
        };

        let client1 = Object.create(WebSocketStub),
            client2 = Object.create(WebSocketStub),
            client1Mock = sinon.mock(client1),
            client2Mock = sinon.mock(client2);

        client1Mock.expects('send').withExactArgs('{"type":"PLAYED_CARDS","data":{"playedCards":["a","b","c"]}}').once();
        client2Mock.expects('send').withExactArgs('{"type":"PLAYED_CARDS","data":{"playedCards":["a","b","c"]}}').once();

        clientCommunication.broadcast([client1, client2], messages.MessageType.PLAYED_CARDS, ['a', 'b', 'c']);

        client1Mock.verify();
        client2Mock.verify();
    });

    it('should send request message to given client and call given function on answer', (done) => {
        let client = {
                send: function () {},
                on: function (message, onMessage) {
                    onMessage(message);
                }
            },
            clientMock = sinon.mock(client);

        clientMock.expects('send').withExactArgs('{"type":"REQUEST_TRUMPF","data":{"pushed":false}}').once();

        clientCommunication.request(client, messages.MessageType.REQUEST_TRUMPF, function onMessage (message, resolve) {
            resolve();
            done();
        }, false);

        clientMock.verify();
    });
});