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
    mockery.enable();
    mockery.registerMock('./game', gameMock);
   
    var session = Object.create(require("../../lib/game/session"));
    
    sinon.spy(gameMock, 'init');
    
    it('should be initialized with new game', function(){   
        assert(!gameMock.init.called);
        session.init(); 
        assert(gameMock.init.called);
        console.log("Calling gameMock.init with: " + JSON.stringify(gameMock.init.getCall(0).args[0]));
    });
    
    after(function(){
        mockery.disable();
    });
});