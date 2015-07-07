'use strict';

let sinon = require('sinon');
let expect = require('chai').expect;
let ClientApi = require('../../../server/communication/clientApi');
let JassSession = require('../../../server/game/session');
let SessionChoice = require('../../../shared/game/sessionChoice');
let sessionHandler = require('../../../server/game/sessionHandler');
let CloseEventCode = require('../../../server/communication/closeEventCode');

let uuidMatcher = sinon.match((name) => {
    return name.length === 36;
});

describe('sessionHandler', () => {
    describe('handleClientConnection', () => {

        let clientApiMock,
            jassSessionFactoryMock,
            webSocket = {
                on: () => {
                }
            },
            sessionName = 'sessionName',
            session,
            sessionMock;

        beforeEach(() => {
            clientApiMock = sinon.mock(Object.getPrototypeOf(ClientApi.create()));
            jassSessionFactoryMock = sinon.mock(JassSession);
            session = {
                addPlayer: () => {
                },
                isComplete: () => {
                },
                start: () => {
                },
                close: () => {
                },
                handlePlayerLeft: () => {
                }

            };
            sessionMock = sinon.mock(session);
        });

        afterEach(() => {
            clientApiMock.restore();
            jassSessionFactoryMock.restore();
            sessionMock.restore();
            sessionHandler.resetInstance();
        });

        it('should create random Session name and add player', (done) => {
            clientApiMock.expects('requestPlayerName').once().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({}));

            jassSessionFactoryMock.expects('create').withArgs(uuidMatcher).once().returns(session);
            sessionMock.expects('isComplete').once().returns(false);

            let promise = sessionHandler.handleClientConnection(webSocket);

            promise.then(() => {
                clientApiMock.verify();
                jassSessionFactoryMock.verify();
                sessionMock.verify();
                done();
            }).catch(done);
        });

        it('should create Session and add player', (done) => {
            clientApiMock.expects('requestPlayerName').once().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.CREATE_NEW,
                sessionName: sessionName
            }));

            jassSessionFactoryMock.expects('create').withArgs(sessionName).once().returns(session);
            sessionMock.expects('isComplete').once().returns(false);

            let promise = sessionHandler.handleClientConnection(webSocket);

            promise.then(() => {
                clientApiMock.verify();
                jassSessionFactoryMock.verify();
                sessionMock.verify();
                done();
            }).catch(done);
        });

        it('should join Session and add player', (done) => {
            clientApiMock.expects('requestPlayerName').twice().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.CREATE_NEW,
                sessionName: sessionName
            }));

            session.name = sessionName;
            jassSessionFactoryMock.expects('create').withArgs(sessionName).once().returns(session);
            sessionMock.expects('isComplete').exactly(4).returns(false);

            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, [sessionName]).returns(Promise.resolve({
                sessionChoice: SessionChoice.JOIN_EXISTING,
                sessionName: sessionName
            }));

            sessionHandler.handleClientConnection(webSocket).then(() => {
                return sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    sessionMock.verify();
                    done();
                });
            }).catch(done);
        });

        it('should autojoin Session and add player', (done) => {
            clientApiMock.expects('requestPlayerName').twice().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.CREATE_NEW,
                sessionName: sessionName
            }));

            session.name = sessionName;
            jassSessionFactoryMock.expects('create').withArgs(sessionName).once().returns(session);
            sessionMock.expects('isComplete').exactly(4).returns(false);

            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, [sessionName]).returns(Promise.resolve({}));

            sessionHandler.handleClientConnection(webSocket).then(() => {
                return sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    sessionMock.verify();
                    done();
                });
            }).catch(done);
        });

        it('should not show complete sessions and remove finished sessions from sessions array', (done) => {
            clientApiMock.expects('requestPlayerName').twice().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.CREATE_NEW,
                sessionName: sessionName
            }));

            jassSessionFactoryMock.expects('create').withArgs(sessionName).once().returns(session);

            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({}));
            sessionMock.expects('addPlayer').once();
            sessionMock.expects('isComplete').once().returns(true);
            sessionMock.expects('start').once().returns(Promise.resolve({name: 'team'}));
            sessionMock.expects('close').once();

            jassSessionFactoryMock.expects('create').withArgs(uuidMatcher).once().returns(session);
            sessionMock.expects('addPlayer').once();
            sessionMock.expects('isComplete').once().returns(false);

            sessionHandler.handleClientConnection(webSocket).then(() => {
                expect(sessionHandler.sessions.length).to.equal(0);

                return sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    sessionMock.verify();
                    done();
                });
            }).catch(done);
        });


        it('should handle a leaving client', (done) => {
            let disconnectMessage = 'message',
                player = {};

            clientApiMock.expects('requestPlayerName').twice().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').twice().returns(Promise.resolve(player));

            jassSessionFactoryMock.expects('create').withArgs(uuidMatcher).once().returns(session);
            sessionMock.expects('addPlayer').twice().returns(player);
            sessionMock.expects('isComplete').exactly(4).returns(false);

            sinon.stub(webSocket, 'on').withArgs('close', sinon.match.func).onCall(1).callsArgWith(1, CloseEventCode.NORMAL, disconnectMessage);
            sessionMock.expects('handlePlayerLeft').withArgs(player, CloseEventCode.NORMAL, disconnectMessage).once();

            sessionHandler.handleClientConnection(webSocket).then(() => {
                expect(sessionHandler.sessions.length).to.equal(1);

                return sessionHandler.handleClientConnection(webSocket).then(() => {
                    expect(sessionHandler.sessions.length).to.equal(0);
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    sessionMock.verify();
                    done();
                });
            }).catch(done);
        });
    });
});