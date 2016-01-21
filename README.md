# Jass Challenge ![Build STatus](https://travis-ci.org/webplatformz/challenge.svg?branch=master) [![Dependencies Status](https://david-dm.org/webplatformz/challenge.png)](https://david-dm.org/webplatformz/challenge)
- JavaScript Challenge Server 
- Frontend displaying scores


### Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

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
While developing you might want to run the server with a watch task. You can either use:
```sh
npm run start:watch
```

This task will start all the other tasks in watch mode. You can also start them directly. E.g.:

```sh
npm run build:js:frontend:watch
```
For more information check the package.json

To get more debug output there is a 'debug' task too:
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
- ECMA Script 6
- NodeJs
- Mocha
- Karma
- Express
- WebSockets
- React
- Flux
