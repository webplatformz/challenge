'use strict';

import {expect} from 'chai';
import TournamentSession from '../../../server/session/tournamentSession.js';

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
});