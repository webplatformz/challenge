import ClientCommunication from '../../../server/communication/clientCommunication';
import * as messages from '../../../shared/messages/messages';
import {MessageType} from '../../../shared/messages/messageType';
import {CardColor} from '../../../shared/deck/cardColor';
import {expect} from 'chai';
import sinon from 'sinon';
import {GameMode} from '../../../shared/game/gameMode';

describe('ClientCommunication', () => {
    describe('toJSON', () => {
        it('should convert message to JSON string', () => {
            let message = messages.create(MessageType.REQUEST_TRUMPF.name, false);

            let actual = ClientCommunication.toJSON(message);

            expect(actual).to.equal('{"type":"REQUEST_TRUMPF","data":false}');
        });
    });

    describe('fromJSON', () => {
        it('should convert JSON string to message', () => {
            let message = '{"type":"REQUEST_TRUMPF","data":false}';

            let actual = ClientCommunication.fromJSON(message);

            expect(actual.type).to.equal(MessageType.REQUEST_TRUMPF.name);
            expect(actual.data).to.eql(false);
        });
    });

    describe('on', () => {

        let sendSpy;

        beforeEach(() => {
            sendSpy = sinon.spy(ClientCommunication, 'send');
        });

        afterEach(() => {
            ClientCommunication.send.restore();
        });

        it('should return function to unbind listener', () => {
            let webSocketStub = {
                on: () => {
                },
                removeListener: sinon.spy()
            };

            const actual = ClientCommunication.on(webSocketStub, MessageType.JOIN_BOT, () => {
            });
            actual();

            sinon.assert.calledWith(webSocketStub.removeListener, 'message', sinon.match.func);
        });

        it('should call given handler on correct messageType', () => {
            let correctMessage = {
                    type: MessageType.JOIN_BOT.name,
                    data: {
                        sessionName: 'sessionName',
                        chosenTeamIndex: 0
                    }
                },
                webSocketStub = {
                    on: (type, givenMessageHandler) => {
                        givenMessageHandler(JSON.stringify(correctMessage));
                    }
                },
                messageHandlerSpy = sinon.spy();

            ClientCommunication.on(webSocketStub, MessageType.JOIN_BOT, messageHandlerSpy);

            sinon.assert.calledWithExactly(messageHandlerSpy, correctMessage);
        });

        it('should not call given handler on other messageTypes', () => {
            let wrongMessage = {
                    type: MessageType.CHOOSE_CARD.name
                },
                webSocketStub = {
                    on: (type, givenMessageHandler) => {
                        givenMessageHandler(JSON.stringify(wrongMessage));
                    }
                },
                messageHandlerSpy = sinon.spy();

            ClientCommunication.on(webSocketStub, MessageType.JOIN_BOT, messageHandlerSpy);

            sinon.assert.notCalled(messageHandlerSpy);
        });

        it('should send BAD_MESSAGE on validation error', () => {
            let invalidMessage = {
                    type: MessageType.JOIN_BOT.name,
                    data: {}
                },
                webSocketStub = {
                    on: (type, givenMessageHandler) => {
                        givenMessageHandler(JSON.stringify(invalidMessage));
                    }
                },
                messageHandlerSpy = sinon.spy();

            ClientCommunication.on(webSocketStub, MessageType.JOIN_BOT, messageHandlerSpy);

            sinon.assert.notCalled(messageHandlerSpy);
            sinon.assert.calledWithExactly(sendSpy, webSocketStub, MessageType.BAD_MESSAGE.name, sinon.match.object);
        });
    });

    describe('await', () => {
        it('should resolve on correct message only', (done) => {
            let messageHandler = () => {
                },
                wrongMessage = {
                    type: MessageType.CHOOSE_SESSION.name
                },
                correctMessage = {
                    type: MessageType.CHOOSE_CARD.name,
                    data: {
                        number: 9,
                        color: CardColor.HEARTS
                    }
                },
                WebSocketStub = {
                    readyState: 1,
                    on: function (type, handlerFunction) {
                        messageHandler = handlerFunction;
                    },
                    removeListener: sinon.spy()
                };

            let client = Object.create(WebSocketStub);

            let actual = ClientCommunication.await(client, MessageType.CHOOSE_CARD);

            messageHandler(JSON.stringify(wrongMessage));
            messageHandler(JSON.stringify(correctMessage));

            actual.then((message) => {
                expect(message).not.to.eql(wrongMessage);
                expect(message).to.eql(correctMessage);
                sinon.assert.calledWith(WebSocketStub.removeListener, 'message', sinon.match.func);
                sinon.assert.calledOnce(WebSocketStub.removeListener);
                done();
            }).catch(done);
        });

        it('should reject on correct message type but invalid message', (done) => {
            let messageHandler,
                invalidMessage = {
                    type: MessageType.CHOOSE_PLAYER_NAME.name
                },
                WebSocketStub = {
                    readyState: 1,
                    on(type, handlerFunction) {
                        messageHandler = handlerFunction;
                    },
                    send: sinon.spy(),
                    removeListener: sinon.spy()
                };

            let client = Object.create(WebSocketStub);

            let actual = ClientCommunication.await(client, MessageType.CHOOSE_PLAYER_NAME);

            messageHandler(JSON.stringify(invalidMessage));

            actual.then(() => done(new Error('Invalid message should be rejected!')), (validationResult) => {
                expect(validationResult).to.have.property('data').that.is.an('array');
                sinon.assert.calledOnce(WebSocketStub.send);
                sinon.assert.calledOnce(WebSocketStub.removeListener);
                sinon.assert.calledWith(WebSocketStub.removeListener, 'message', sinon.match.func);
                done();
            }).catch(done);
        });
    });

    describe('send', () => {
        it('should send message to given client', () => {
            let WebSocketStub = {
                readyState: 1,
                send: function () {
                }
            };

            let client = Object.create(WebSocketStub),
                clientMock = sinon.mock(client);

            clientMock.expects('send').withExactArgs('{"type":"DEAL_CARDS","data":["a","b","c"]}').once();

            ClientCommunication.send(client, MessageType.DEAL_CARDS.name, ['a', 'b', 'c']);

            clientMock.verify();
        });

        it('should not send message if readyState not 1', () => {
            let WebSocketStub = {
                readyState: 0,
                send: function () {
                }
            };

            let client = Object.create(WebSocketStub),
                clientMock = sinon.mock(client);

            clientMock.expects('send').never();

            ClientCommunication.send(client, MessageType.DEAL_CARDS.name, ['a', 'b', 'c']);

            clientMock.verify();
        });
    });

    describe('broadcast', () => {
        it('should broadcast message to all given clients', () => {
            let WebSocketStub = {
                readyState: 1,
                send: function () {
                }
            };

            let client1 = Object.create(WebSocketStub),
                client2 = Object.create(WebSocketStub),
                client1Mock = sinon.mock(client1),
                client2Mock = sinon.mock(client2);

            client1Mock.expects('send').withExactArgs('{"type":"PLAYED_CARDS","data":["a","b","c"]}').once();
            client2Mock.expects('send').withExactArgs('{"type":"PLAYED_CARDS","data":["a","b","c"]}').once();

            ClientCommunication.broadcast([client1, client2], MessageType.PLAYED_CARDS.name, ['a', 'b', 'c']);

            client1Mock.verify();
            client2Mock.verify();
        });
    });

    describe('request', () => {
        it('should send request message to given client and resolve on answer', (done) => {
            const clientMessage = messages.create(MessageType.CHOOSE_TRUMPF.name, {mode: GameMode.OBEABE});
            const clientStub = {
                    readyState: 1,
                    send() {
                    },
                    on(message, onMessage) {
                        onMessage(JSON.stringify(clientMessage));
                    },
                    removeListener() {
                    }
                },
                clientMock = sinon.mock(clientStub);

            clientMock.expects('send').withExactArgs('{"type":"REQUEST_TRUMPF","data":false}').once();
            clientMock.expects('removeListener').withArgs('message', sinon.match.func).once();

            ClientCommunication.request(clientStub, MessageType.REQUEST_TRUMPF.name, MessageType.CHOOSE_TRUMPF, 0, false)
                .then((message) => {
                    expect(message).to.eql(clientMessage.data);
                    done();
                })
                .catch(done);

        });

        it('should reject when timeout exceeded', (done) => {
            const clientStub = {
                readyState: 1,
                on() {
                },
                send: sinon.spy(),
                removeListener: sinon.spy()
            };

            ClientCommunication.request(clientStub, MessageType.REQUEST_CARD.name, MessageType.CHOOSE_CARD, 1, false)
                .then(
                    () => done(new Error('should not resolve on timeout exceeed')),
                    (errorMessage) => {
                        expect(errorMessage).to.equal('Request timeout of 1 ms exceeded');
                        sinon.assert.calledWithExactly(clientStub.removeListener, 'message', sinon.match.func);
                        sinon.assert.calledWithExactly(clientStub.send, '{"type":"REQUEST_CARD","data":false}');
                        done();
                    }
                )
                .catch(done);

        });

        it('should reject invalid answer messages', (done) => {
            const clientAnswer = JSON.stringify(messages.create(MessageType.PLAYED_CARDS.name, ['a', 'b', 'c']));
            const clientStub = {
                readyState: 1,
                on(message, onMessage) {
                    onMessage(clientAnswer);
                },
                send: sinon.spy(),
                removeListener: sinon.spy()
            };

            ClientCommunication.request(clientStub, MessageType.REQUEST_PLAYER_NAME.name, MessageType.CHOOSE_PLAYER_NAME, 0)
                .catch((data) => {
                    expect(data).to.equal('Invalid Message: ' + clientAnswer + ', expected message with type: CHOOSE_PLAYER_NAME');
                    done();
                })
                .catch(done);
        });

        it('should reject empty answer messages', (done) => {
            const clientStub = {
                readyState: 1,
                on(message, onMessage) {
                    onMessage('');
                },
                send: sinon.spy(),
                removeListener: sinon.spy()
            };

            ClientCommunication.request(clientStub, MessageType.REQUEST_PLAYER_NAME.name, MessageType.CHOOSE_PLAYER_NAME, 0)
                .catch((data) => {
                    expect(data).to.equal('Invalid Message: , expected message with type: CHOOSE_PLAYER_NAME');
                    done();
                })
                .catch(done);
        });

        it('should reject wrong data type', (done) => {
            const clientAnswer = JSON.stringify(messages.create(MessageType.CHOOSE_PLAYER_NAME.name, 13));
            const clientStub = {
                readyState: 1,
                on(message, onMessage) {
                    onMessage(clientAnswer);
                },
                send: sinon.spy(),
                removeListener: sinon.spy()
            };

            ClientCommunication.request(clientStub, MessageType.REQUEST_PLAYER_NAME.name, MessageType.CHOOSE_PLAYER_NAME, 0)
                .catch((data) => {
                    expect(data.data).to.eql(['Data has an incorrect length']);
                    done();
                })
                .catch(done);
        });
    });
});