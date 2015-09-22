'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import TournamentSession from '../../../server/session/tournamentSession.js';
import CloseEventCode from '../../../server/communication/closeEventCode.js';

describe('tournamentSession', () => {

    describe('create', () => {
        it('should initialize name and players', () => {
            let sessionName = 'sessionName';

            let session = TournamentSession.create(sessionName);

            expect(session.name).to.equal(sessionName);
            expect(session.players).to.eql([]);
            expect(session.spectators).to.eql([]);
        });
    });

    describe('addPlayer', () => {

        let session,
            clientApiMock,
            playerName = 'playerName',
            webSocket = 'webSocket';

        beforeEach(() => {
            session = TournamentSession.create('sessionName');
            clientApiMock = sinon.mock(session.clientApi);
        });

        afterEach(() => {
            clientApiMock.restore();
        });

        it('should add player to clientApi and player array', () => {
            clientApiMock.expects('addClient').withArgs(webSocket).once();

            session.addPlayer(webSocket, playerName);

            clientApiMock.verify();
        });

        it('should add object to player array', () => {
            session.addPlayer(webSocket, playerName);

            expect(session.players[0]).to.eql({
                playerName,
                clients: [
                    webSocket
                ]
            });
        });

        it('should add client to already existing playerName', () => {
            session.addPlayer(webSocket, playerName);
            session.addPlayer(webSocket, playerName);

            expect(session.players).to.have.length(1);
            expect(session.players[0]).to.eql({
                playerName,
                clients: [
                    webSocket,
                    webSocket
                ]
            });
        });

        it('should not add client to already existing playerName with two clients', () => {
            clientApiMock.expects('removeClient').withArgs(webSocket, CloseEventCode.ABNORMAL, sinon.match.string).once();

            session.addPlayer(webSocket, playerName);
            session.addPlayer(webSocket, playerName);
            session.addPlayer(webSocket, playerName);

            expect(session.players).to.have.length(1);
            expect(session.players[0].clients).to.have.length(2);
            clientApiMock.verify();
        });
    });

    describe('addSpectator', () => {

        let session,
            clientApiMock;

        beforeEach(() => {
            session = TournamentSession.create('sessionName');
            clientApiMock = sinon.mock(session.clientApi);
        });

        afterEach(() => {
            clientApiMock.restore();
        });

        it('should add spectator to clientapi', () => {
            let webSocket = 'webSocket';
            clientApiMock.expects('addClient').withArgs(webSocket).once();

            session.addSpectator(webSocket);

            clientApiMock.verify();
        });

        it('should add spectator to spectator array', () => {
            let webSocket = 'webSocket';

            session.addSpectator(webSocket);

            expect(session.spectators).to.have.length(1);
            expect(session.spectators[0]).to.equal(webSocket);
        });
    });
});