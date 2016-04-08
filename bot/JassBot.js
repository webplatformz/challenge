'use strict';

import WebSocket from 'ws';
import GameType from '../server/game/gameType';
import {GameMode} from '../shared/game/gameMode';
import Card from '../shared/deck/card';
import {CardColor} from '../shared/deck/cardColor';
import Validation from '../server/game/validation/validation';
import * as messages from '../shared/messages/messages';
import {MessageType} from '../shared/messages/messageType';
import {SessionChoice} from '../shared/session/sessionChoice';

let JassBot = {
    gameType: GameType.create(GameMode.TRUMPF, CardColor.SPADES),

    onMessage : function (messageJson) {
        let message = JSON.parse(messageJson);

        if (message.type === MessageType.REQUEST_PLAYER_NAME.name) {
            this.client.send(JSON.stringify(messages.create(MessageType.CHOOSE_PLAYER_NAME.name, this.name)));
        }

        if (message.type === MessageType.REQUEST_SESSION_CHOICE.name) {
                this.client.send(JSON.stringify(messages.create(MessageType.CHOOSE_SESSION.name, SessionChoice.AUTOJOIN)));
        }

        if (message.type === MessageType.DEAL_CARDS.name) {
            this.handcards = this.mapCardsFromJson(message.data);
        }

        if (message.type === MessageType.REQUEST_CARD.name) {
            let handCard = this.giveValidCardFromHand(this.mapCardsFromJson(message.data), this.handcards);
            this.handcards.splice(this.handcards.indexOf(handCard), 1);
            let chooseCardResonse = messages.create(MessageType.CHOOSE_CARD.name, handCard);
            this.client.send(JSON.stringify(chooseCardResonse));
        }

        if (message.type === MessageType.REQUEST_TRUMPF.name) {
            let chooseTrumpfResponse = messages.create(MessageType.CHOOSE_TRUMPF.name, this.gameType);
            this.client.send(JSON.stringify(chooseTrumpfResponse));
        }
    },

    mapCardsFromJson : function(cards) {
        return cards.map((element) => {
            return Card.create(element.number, element.color);
        });
    },

    giveValidCardFromHand : function(tableCards, handCards) {
        let validation = Validation.create(this.gameType.mode, this.gameType.trumpfColor);

        for(let i = 0; i < handCards.length; i++) {
            let handCard = handCards[i];

            if(validation.validate(tableCards, handCards, handCard)) {
                return handCard;
            }
        }
    }
};

export default {
    create: function create(name) {
        let clientBot = Object.create(JassBot);
        clientBot.handcards = [];
        clientBot.client = new WebSocket('ws://localhost:3000');
        clientBot.client.on('message', clientBot.onMessage.bind(clientBot));
        clientBot.name = name;
        return clientBot;
    }
};