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
            webSocket,
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
                },
                addSpectator: () => {
                }
            };
            sessionMock = sinon.mock(session);
            webSocket = {
                ping: () => {
                }
            };
        });

        afterEach(() => {
            clientApiMock.restore();
            jassSessionFactoryMock.restore();
            sessionMock.restore();
            sessionHandler.resetInstance();
        });

        it('should setup sessionkeepalive and create random Session name and add player', (done) => {
            let pingSpy = sinon.spy(webSocket, 'ping');
            clientApiMock.expects('requestPlayerName').once().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({}));

            jassSessionFactoryMock.expects('create').withArgs(uuidMatcher).once().returns(session);
            sessionMock.expects('addPlayer').once().returns(Promise.resolve());
            sessionMock.expects('isComplete').once().returns(false);

            let promise = sessionHandler.handleClientConnection(webSocket);

            expect(pingSpy.calledOnce).to.equal(true);

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
            sessionMock.expects('addPlayer').once().returns(Promise.resolve());
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
            sessionMock.expects('addPlayer').twice().returns(Promise.resolve());
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
            sessionMock.expects('addPlayer').twice().returns(Promise.resolve());
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

        it('should create Session and add spectator', (done) => {
            clientApiMock.expects('requestPlayerName').once().returns(Promise.resolve());
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.SPECTATOR,
                sessionName: sessionName
            }));

            session.name = sessionName;
            jassSessionFactoryMock.expects('create').withArgs(sessionName).once().returns(session);
            sessionMock.expects('addSpectator').once();
            sessionMock.expects('addPlayer').never();
            sessionMock.expects('isComplete').never();

            sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    jassSessionFactoryMock.verify();
                    sessionMock.verify();
                    done();
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
            sessionMock.expects('addPlayer').twice().returns(Promise.resolve());
            sessionMock.expects('isComplete').once().returns(true);
            sessionMock.expects('start').once().returns(Promise.resolve({name: 'team'}));
            sessionMock.expects('close').once();

            jassSessionFactoryMock.expects('create').withArgs(uuidMatcher).once().returns(session);
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
            let playerName = 'playerName',
                rejectedPromise = Promise.reject();

            clientApiMock.expects('requestPlayerName').twice().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').twice().returns(Promise.resolve({}));

            jassSessionFactoryMock.expects('create').withArgs(uuidMatcher).once().returns(session);
            sessionMock.expects('addPlayer').once().returns(Promise.resolve());
            sessionMock.expects('addPlayer').once().returns(rejectedPromise);
            sessionMock.expects('isComplete').exactly(4).returns(false);


            sessionHandler.handleClientConnection(webSocket).then(() => {
                expect(sessionHandler.sessions.length).to.equal(1);

                return sessionHandler.handleClientConnection(webSocket).then(() => {
                    return rejectedPromise.catch(() => {
                        expect(sessionHandler.sessions.length).to.equal(0);
                        clientApiMock.verify();
                        jassSessionFactoryMock.verify();
                        sessionMock.verify();
                        done();
                    });
                });
            }).catch(done);
        });
    });
})
;