'use strict';

let clientCommunication = require('../../../server/communication/clientCommunication'),
    WebSocket = require('ws'),
    messages = require('../../../shared/messages/messages'),
    MessageType = require('../../../shared/messages/messageType'),
    expect = require('chai').expect,
    sinon = require('sinon');

describe('clientCommunication', () => {
    it('should convert message to JSON string', () => {
        let message = messages.create(MessageType.REQUEST_TRUMPF.name, false);

        let actual = clientCommunication.toJSON(message);

        expect(actual).to.equal('{"type":"REQUEST_TRUMPF","data":false}');
    });

    it('should convert JSON string to message', () => {
        let message = '{"type":"REQUEST_TRUMPF","data":false}';

        let actual = clientCommunication.fromJSON(message);

        expect(actual.type).to.equal(MessageType.REQUEST_TRUMPF.name);
        expect(actual.data).to.eql(false);
    });

    it('should send message to given client', () => {
        let WebSocketStub = {
            send: function () {
            }
        };

        let client = Object.create(WebSocketStub),
            clientMock = sinon.mock(client);

        clientMock.expects('send').withExactArgs('{"type":"DEAL_CARDS","data":["a","b","c"]}').once();

        clientCommunication.send(client, MessageType.DEAL_CARDS.name, ['a', 'b', 'c']);

        clientMock.verify();
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

        client1Mock.expects('send').withExactArgs('{"type":"PLAYED_CARDS","data":["a","b","c"]}').once();
        client2Mock.expects('send').withExactArgs('{"type":"PLAYED_CARDS","data":["a","b","c"]}').once();

        clientCommunication.broadcast([client1, client2], MessageType.PLAYED_CARDS.name, ['a', 'b', 'c']);

        client1Mock.verify();
        client2Mock.verify();
    });

    it('should send request message to given client and call given function on answer', (done) => {
        let client = {
                send: function () {
                },
                on: function (message, onMessage) {
                    onMessage(message);
                },
                removeListener: function() {
                }
            },
            clientMock = sinon.mock(client);

        clientMock.expects('send').withExactArgs('{"type":"REQUEST_TRUMPF","data":false}').once();
        clientMock.expects('removeListener').withArgs('message', sinon.match.func).once();

        clientCommunication.request(client, MessageType.REQUEST_TRUMPF.name, function onMessage(message, resolve) {
            resolve();
            clientMock.verify();
            done();
        }, false);

    });
});