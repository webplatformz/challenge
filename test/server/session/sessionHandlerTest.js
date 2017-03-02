

import sinon from 'sinon';
import {expect} from 'chai';
import * as ClientApi from '../../../server/communication/clientApi';
import * as SingleGameSession from '../../../server/session/singleGameSession';
import * as TournamentSession from '../../../server/session/tournamentSession';
import {SessionChoice} from '../../../shared/session/sessionChoice';
import {SessionType} from '../../../shared/session/sessionType';
import sessionHandler from '../../../server/session/sessionHandler';

describe('sessionHandler', () => {
    describe('handleClientConnection', () => {

        let clientApiMock,
            singleGameSessionMock,
            tournamentSessionMock,
            webSocket,
            sessionName = 'sessionName',
            session,
            sessionMock;

        beforeEach(() => {
            clientApiMock = sinon.mock(Object.getPrototypeOf(ClientApi.create()));
            singleGameSessionMock = sinon.mock(SingleGameSession);
            tournamentSessionMock = sinon.mock(TournamentSession);
            session = {
                type: SessionType.SINGLE_GAME,
                addPlayer: () => {},
                isComplete: () => {},
                start: () => {},
                close: () => {},
                handlePlayerLeft: () => {},
                addSpectator: () => {}
            };
            sessionMock = sinon.mock(session);
            webSocket = {
                ping: () => {},
                on:() => {},
                removeListener: () => {}
            };
        });

        afterEach(() => {
            clientApiMock.restore();
            singleGameSessionMock.restore();
            tournamentSessionMock.restore();
            sessionMock.restore();
            sessionHandler.resetInstance();
        });

        it('should setup sessionkeepalive and create random Session name and add player', (done) => {
            let pingSpy = sinon.spy(webSocket, 'ping');
            webSocket.readyState = 1;
            clientApiMock.expects('requestPlayerName').once().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({}));

            singleGameSessionMock.expects('create').withArgs(sinon.match.string).once().returns(session);
            sessionMock.expects('addPlayer').once();
            sessionMock.expects('isComplete').once().returns(false);

            let promise = sessionHandler.handleClientConnection(webSocket);

            sinon.assert.calledOnce(pingSpy);

            promise.then(() => {
                clientApiMock.verify();
                singleGameSessionMock.verify();
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

            singleGameSessionMock.expects('create').withArgs(sessionName).once().returns(session);
            sessionMock.expects('addPlayer').once();
            sessionMock.expects('isComplete').once().returns(false);

            let promise = sessionHandler.handleClientConnection(webSocket);

            promise.then(() => {
                clientApiMock.verify();
                singleGameSessionMock.verify();
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
            singleGameSessionMock.expects('create').withArgs(sessionName).once().returns(session);
            sessionMock.expects('addPlayer').twice();

            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, [sessionName]).returns(Promise.resolve({
                sessionChoice: SessionChoice.JOIN_EXISTING,
                sessionName: sessionName
            }));

            sessionHandler.handleClientConnection(webSocket).then(() => {
                return sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    singleGameSessionMock.verify();
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
            singleGameSessionMock.expects('create').withArgs(sessionName).once().returns(session);
            sessionMock.expects('addPlayer').twice();

            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, [sessionName]).returns(Promise.resolve({}));

            sessionHandler.handleClientConnection(webSocket).then(() => {
                return sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    singleGameSessionMock.verify();
                    sessionMock.verify();
                    done();
                });
            }).catch(done);
        });

        it('should create Session and add spectator', (done) => {
            clientApiMock.expects('requestPlayerName').once().returns(Promise.resolve());
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.SPECTATOR,
                sessionName
            }));

            session.name = sessionName;
            singleGameSessionMock.expects('create').withArgs(sessionName).once().returns(session);
            sessionMock.expects('addSpectator').once();
            sessionMock.expects('addPlayer').never();
            sessionMock.expects('isComplete').never();

            sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    singleGameSessionMock.verify();
                    sessionMock.verify();
                    done();
            }).catch(done);
        });

        it('should create Tournament and join as spectator', (done) => {
            clientApiMock.expects('requestPlayerName').once().returns(Promise.resolve());
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.CREATE_NEW_SESSION,
                sessionName,
                sessionType: SessionType.TOURNAMENT,
                asSpectator: true
            }));
            let startPromise = Promise.resolve();
            clientApiMock.expects('waitForTournamentStart').withArgs(webSocket).once().returns(startPromise);

            session.name = sessionName;
            session.type = SessionType.TOURNAMENT;
            tournamentSessionMock.expects('create').withArgs(sessionName).once().returns(session);
            sessionMock.expects('addSpectator').once();
            sessionMock.expects('addPlayer').never();
            sessionMock.expects('isComplete').once().returns(true);
            sessionMock.expects('start').once().returns(Promise.resolve());

            sessionHandler.handleClientConnection(webSocket).then(() => {
                clientApiMock.verify();
                singleGameSessionMock.verify();
                startPromise.then(() => sessionMock.verify()).catch(done);
                done();
            }).catch(done);
        });

        it('should not show complete sessions and remove finished sessions from sessions array', (done) => {
            clientApiMock.expects('requestPlayerName').twice().returns(Promise.resolve('playerName'));
            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({
                sessionChoice: SessionChoice.CREATE_NEW,
                sessionName: sessionName
            }));

            singleGameSessionMock.expects('create').withArgs(sessionName).once().returns(session);

            clientApiMock.expects('requestSessionChoice').once().withArgs(webSocket, []).returns(Promise.resolve({}));
            sessionMock.expects('addPlayer').twice();
            sessionMock.expects('isComplete').once().returns(true);
            sessionMock.expects('start').once().returns(Promise.resolve({name: 'team'}));
            sessionMock.expects('close').once();

            singleGameSessionMock.expects('create').withArgs(sinon.match.string).once().returns(session);
            sessionMock.expects('isComplete').once().returns(false);

            sessionHandler.handleClientConnection(webSocket).then(() => {
                expect(sessionHandler.sessions).to.have.length(0);

                return sessionHandler.handleClientConnection(webSocket).then(() => {
                    clientApiMock.verify();
                    singleGameSessionMock.verify();
                    sessionMock.verify();
                    done();
                });
            }).catch(done);
        });
    });
});
