# Jass Challenge ![Build STatus](https://travis-ci.org/webplatformz/challenge.svg?branch=master) [![Dependencies Status](https://david-dm.org/webplatformz/challenge.png)](https://david-dm.org/webplatformz/challenge)
- JavaScript Challenge Server 
- Frontend displaying scores


###Wiki:
https://github.com/webplatformz/challenge/wiki

###Styleguide: 
https://github.com/RisingStack/node-style-guide

### Build Server
https://travis-ci.org/webplatformz/challenge

## Installation
You only need to have node.js and bower installed. 

Installing node.js: 

See http://nodejs.org/download/

Install node modules:
```sh
$ npm install
```

Start the server:
```sh
$ npm start
```

## Development
While developing use grunt watch. It will automatically execute all unit tests on change.
Grunt watch and livereload is defined as default target. 
Start it with:

```sh
$ grunt
```
With this task you will also get a debug output on the server with every message sent/received like this:
```
<-- Start Broadcast: 
<-- Send Message: {"type":"BROADCAST_WINNER_TEAM","data":{"name":"Team 2","points":0,"currentRoundPoints":0}}
<-- Send Message: {"type":"REQUEST_PLAYER_NAME"}
<-- Received Message: {"type":"CHOOSE_PLAYER_NAME","data":"PlayerName"}
<-- Send Message: {"type":"REQUEST_SESSION_CHOICE","data":[]}
<-- Received Message: {"type":"CHOOSE_SESSION","data":{"sessionChoice":"AUTOJOIN"}}
<-- Start Broadcast: 
<-- Send Message: {"type":"BROADCAST_SESSION_JOINED","data":{"name":"PlayerName","id":0}}
End Broadcast -->
```

or if you just want to start the server without watching and debug output use:

```sh
$ npm start
```

## TechStack
- NodeJs
- Grunt
- Mocha
- Express
- WebSockets
