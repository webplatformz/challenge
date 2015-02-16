"use strict";

function Schieber() {
    this.players = [];
}

Schieber.prototype.addPlayer = function(name) {
    if(this.players.length === 4) {
        this.fireEvent("test");
    }
    this.players.push(name);
};

Schieber.prototype.fireEvent = function(event) {

};

module.exports = Schieber;
