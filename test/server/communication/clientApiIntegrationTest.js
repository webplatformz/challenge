'use strict';

let expect = require('chai').expect,
    WebSocket = require('ws'),
    WebSocketServer = require('ws').Server,
    ClientApi = require('../../../server/communication/clientApi'),
    GameType = require('../../../server/game/game').GameType,
    GameMode = require('../../../server/game/gameMode'),
    Card = require('../../../shared/deck/card'),
    CardColor = Card.CardColor,
    Validation = require('../../../server/game/validation/validation'),
    JassSession = require('../../../server/game/session');

let messages = require('../../../shared/messages/messages');


let trumpf = CardColor.SPADES;

let giveValidCardFromHand = function(tableCards, handCards) {
    let cardToPlay;

    let validation = Validation.create(GameMode.TRUMPF, trumpf);
    handCards.forEach((handCard) => {
        if(validation.validate(tableCards, handCards, handCard)) {
            cardToPlay = handCard;
        }
    });

    return cardToPlay;
};


let choosePlayerName = (name) => {
    return messages.create(messages.MessageType.CHOOSE_PLAYER_NAME, name);
};

let mapCardsFromJson = function(cards) {
    return cards.map((element) => {
        return Card.create(element.number, element.color);
    });
};

function createClient() {
    return new WebSocket('ws://localhost:10001');
}

let Client = {
    handcards : [],
    name: [],

    onMessage : function (messageJson) {
        let message = JSON.parse(messageJson);

        if (message.type === messages.MessageType.REQUEST_PLAYER_NAME) {
            this.client.send(JSON.stringify(choosePlayerName(this.name)));
        }

        if (message.type === messages.MessageType.DEAL_CARDS) {
            this.handcards = mapCardsFromJson(message.data);
        }

        if (message.type === messages.MessageType.BROADCAST_WINNER_TEAM) {
            this.doneFunction();
        }

        if (message.type === messages.MessageType.REQUEST_CARD) {
            let handCard = giveValidCardFromHand(mapCardsFromJson(message.data), this.handcards);
            this.handcards.splice(this.handcards.indexOf(handCard), 1);
            let chooseCardResonse = messages.create(messages.MessageType.CHOOSE_CARD, handCard);
            this.client.send(JSON.stringify(chooseCardResonse));
        }

        if (message.type === messages.MessageType.REQUEST_TRUMPF) {
            let gameType = GameType.create(GameMode.TRUMPF, trumpf);
            let chooseTrumpfResponse = messages.create(messages.MessageType.CHOOSE_TRUMPF, gameType);
            this.client.send(JSON.stringify(chooseTrumpfResponse));
        }
    },

    create: function create(name, doneFunction) {
        let clientBot = Object.create(Client);
        clientBot.doneFunction = doneFunction;
        clientBot.client = new WebSocket('ws://localhost:10001');
        let boundOnMessage = clientBot.onMessage.bind(clientBot);
        clientBot.client.on('message', boundOnMessage);
        clientBot.name = name;
        return clientBot;
    }
};



describe('Integration test', () => {

    let wss,
        clientApi;

    beforeEach(() => {
        wss = new WebSocketServer({port: 10001});
        clientApi = ClientApi.create();
    });

    afterEach(() => {
        wss.close();
    });

    describe('Play a complete game', () => {
        it('should start the game after 4 players have been connected', (done) => {
            let session = JassSession.create();

            wss.on('connection', (ws) => {
                session.addPlayer(ws);
                if (session.isComplete()) {
                    session.start().then((team) => {
                        console.log("Team " + team.name + " won ");
                    });
                    session = JassSession.create();
                }
            });

            let emptyFunction = () => {};
            Client.create("Client 1", done);
            Client.create("Client 2", emptyFunction);
            Client.create("Client 3", emptyFunction);
            Client.create("Client 4", emptyFunction);
        });
    });

});
