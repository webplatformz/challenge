'use strict';

let sinon = require('sinon');
let expect = require('chai').expect;
let ClientApi = require('../../../server/communication/clientApi');
let JassSession = require('../../../server/game/session');
let SessionChoice = require('../../../shared/game/sessionChoice');
let sessionHandler = require('../../../server/game/sessionHandler');

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
            webSocketMock,
            sessionName = 'sessionName',
            session,
            sessionMock;

        beforeEach(() => {
            clientApiMock = sinon.mock(Object.getPrototypeOf(ClientApi.create()));
            jassSessionFactoryMock = sinon.mock(JassSession);
            webSocketMock = sinon.mock(webSocket);
            session = {
                addPlayer: () => {
                },
                isComplete: () => {
                },
                start: () => {
                },
                close: () => {
                }

            };
            sessionMock = sinon.mock(session);
        });

        afterEach(() => {
            clientApiMock.restore();
            jassSessionFactoryMock.restore();
            sessionMock.restore();
            webSocketMock.restore();
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
                sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    sessionMock.verify();
                    done();
                }).catch(done);
            });
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
                sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    sessionMock.verify();
                    done();
                }).catch(done);
            });
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

                sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    sessionMock.verify();
                    done();
                }).catch(done);
            }).catch(done);
        });


        it('should handle a leaving client', () => {


        });
    });
});