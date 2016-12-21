import {expect} from 'chai';
import * as SimpleBot from './SimpleBot';

import * as Server from '../../../server/server';

describe('Integration test', function() {
    this.timeout(10 * 1000);

    beforeEach(() => {
        Server.start(10001);
    });

    afterEach(() => {
        Server.stop();
    });

    describe('Play a complete game', () => {
        it('should start the game after 4 players have been connected', (done) => {
            let emptyFunction = () => {};
            SimpleBot.create(1, 'Client 1', done);
            setTimeout(() => {
                SimpleBot.create(2, 'Client 2', emptyFunction);
                SimpleBot.create(3, 'Client 3', emptyFunction);
                SimpleBot.create(4, 'Client 4', emptyFunction);
            }, 10); //wait for session to be created
        });
    });

});
