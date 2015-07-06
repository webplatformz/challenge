'use strict';

let sinon = require('sinon');
let ClientApi = require('../../../server/communication/clientApi');
let JassSession = require('../../../server/game/session');
let SessionChoice = require('../../../server/game/sessionChoice');
let sessionHandler = require('../../../server/game/sessionHandler');

describe('sessionHandler', () => {
    describe('handleClientConnection', () => {

        let clientApiMock,
            jassSessionFactoryMock;

        beforeEach(() => {
            clientApiMock = sinon.mock(Object.getPrototypeOf(ClientApi.create()));
            jassSessionFactoryMock = sinon.mock(JassSession);
        });

        afterEach(() => {
            clientApiMock.restore();
            jassSessionFactoryMock.restore();
            sessionHandler.resetInstance();
        });

        it('should create Session and add player', (done) => {
            let sessionName = 'sessionName',
                webSocket = 'webSocket';

            clientApiMock.expects('requestPlayerName').once().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.CREATE_NEW,
                sessionName: sessionName
            }));

            jassSessionFactoryMock.expects('create').withArgs(sessionName).once().returns({
                addPlayer: () => {
                },
                isComplete: () => {
                    return false;
                }
            });

            let promise = sessionHandler.handleClientConnection(webSocket);

            promise.then(() => {
                clientApiMock.verify();
                jassSessionFactoryMock.verify();
                done();
            }).catch(done);
        });

        it('should join Session and add player', (done) => {
            let sessionName = 'sessionName',
                webSocket = 'webSocket';

            clientApiMock.expects('requestPlayerName').twice().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.CREATE_NEW,
                sessionName: sessionName
            }));

            jassSessionFactoryMock.expects('create').withArgs(sessionName).once().returns({
                name: sessionName,

                addPlayer: () => {
                },
                isComplete: () => {
                    return false;
                }
            });

            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, [sessionName]).returns(Promise.resolve({
                sessionChoice: SessionChoice.JOIN_EXISTING,
                sessionName: sessionName
            }));

            sessionHandler.handleClientConnection(webSocket).then(() => {
                sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    done();
                }).catch(done);
            });
        });

        it('should autojoin Session and add player', (done) => {
            let sessionName = 'sessionName',
                webSocket = 'webSocket';

            clientApiMock.expects('requestPlayerName').twice().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.CREATE_NEW,
                sessionName: sessionName
            }));

            jassSessionFactoryMock.expects('create').withArgs(sessionName).once().returns({
                name: sessionName,

                addPlayer: () => {
                },
                isComplete: () => {
                    return false;
                }
            });

            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, [sessionName]).returns(Promise.resolve({}));

            sessionHandler.handleClientConnection(webSocket).then(() => {
                sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    done();
                }).catch(done);
            });
        });
    });
});