import {expect} from 'chai';
import fs from 'fs';
import sinon from 'sinon';
import * as JsonResultProxy from '../../../server/communication/jsonResultProxy';
import {MessageType} from '../../../shared/messages/messageType';

describe('JsonResultProxy', () => {

    let fileStreamStub,
        writeSpy,
        onSpy,
        closeSpy;

    beforeEach(() => {
        writeSpy = sinon.spy();
        onSpy = sinon.spy();
        closeSpy = sinon.spy();
        fileStreamStub = sinon.stub(fs, 'WriteStream').returns({
            write: writeSpy,
            on: onSpy,
            close: closeSpy
        });
    });

    afterEach(() => {
        fileStreamStub.restore();
    });

    it('should open FileStream', () => {
        new Proxy({}, JsonResultProxy.create('mySession'));

        sinon.assert.calledOnce(fileStreamStub);
        sinon.assert.calledWith(writeSpy, '[');
    });

    it('should close FileStream', () => {
        const proxy = JsonResultProxy.create('mySession');
        new Proxy({}, proxy);

        proxy.destroy();
        const closingCallback = writeSpy.args[1][1];
        closingCallback();

        sinon.assert.calledWith(writeSpy, ']', sinon.match.func);
        sinon.assert.calledOnce(closeSpy);
    });

    it('should write to filestream when message sent', () => {
        const jassChallengeId = 'jassChallengeId';
        const messageType = 'messageType';
        const data = 'data';
        const objectToProxy = {
            send() {
            }
        };

        const actual = new Proxy(objectToProxy, JsonResultProxy.create('mySession'));
        actual.send({jassChallengeId: jassChallengeId}, messageType, data);

        sinon.assert.calledWith(writeSpy, JSON.stringify({
            broadcast: false,
            sentTo: jassChallengeId,
            messageType,
            data
        }));
    });

    it('should write to filestream when message received', (done) => {
        const jassChallengeId = 'jassChallengeId';
        const clientData = 'clientData';
        const clientPromise = new Promise((resolve) => resolve(clientData));
        const objectToProxy = {
            request: () => clientPromise
        };

        const actual = new Proxy(objectToProxy, JsonResultProxy.create('mySession'));
        actual.request({jassChallengeId: jassChallengeId}, MessageType.REQUEST_TRUMPF.name, 'data');

        clientPromise.then(() => {
            sinon.assert.calledWith(writeSpy, ',' + JSON.stringify({
                broadcast: false,
                receivedFrom: jassChallengeId,
                messageType: MessageType.CHOOSE_TRUMPF.name,
                data: clientData
            }));
            done();
        }).catch(done);
    });
});