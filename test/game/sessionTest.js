'use strict';

var assert = require("assert"); // node.js core module
var mockery = require('mockery');
var sinon = require('sinon');

var gameMock = {
    init : function(){
    },
    chooseTrump : function() {
    }
};

describe('Session', function(){    
    mockery.enable({
        warnOnUnregistered: false
    });
    mockery.registerMock('./game', gameMock);
    
    var session;
   
    beforeEach(function(){
        session = Object.create(require("../../lib/game/session")).init(); 
        sinon.spy(gameMock, 'init');
    });    
    
    it('should be able to add 3 player ', function(){
        session.addPlayer("Donald_P1");
        session.addPlayer("Dagobert_P2");
        session.addPlayer("Mickey_P3");
        assert(!gameMock.init.called);
    });
    
    it('should trigger init when 4 players added with correct args', function(){        
        session.addPlayer("Donald_P1");
        session.addPlayer("Dagobert_P2");
        session.addPlayer("Mickey_P3");
        session.addPlayer("Tick_P4");
        assert(gameMock.init.called);
        var firstArg = gameMock.init.getCall(0).args[0];
        var secondArg = gameMock.init.getCall(0).args[1];
        assert.equal(firstArg[0][0].id, "Donald_P1");
        assert.equal(firstArg[1][1].id, "Tick_P4");
        assert.equal(secondArg, 2500); 
    });
    
    afterEach(function(){
        gameMock.init.restore();
        mockery.disable();
    });
    
    after(function(){
        mockery.disable();
    });
});