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
   
    var session = Object.create(require("../../lib/game/session"));    
    
    it('should be able to add 3 player ', function(){
        
    });
    
    it('should be initialized with new game', function(){  
        sinon.spy(gameMock, 'init');
        assert(!gameMock.init.called);
        session.init(); 
        assert(gameMock.init.called);
        console.log("Calling gameMock.init with: " + JSON.stringify(gameMock.init.getCall(0).args[0]));
    });
    
    after(function(){
        mockery.disable();
    });
});