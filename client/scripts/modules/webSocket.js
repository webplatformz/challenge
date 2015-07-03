'use strict';

let secureCb,
    secureCbLabel,
    wsUri,
    consoleLog,
    connectBut,
    disconnectBut,
    clearLogBut,
    websocket,
    messages = require('../../../shared/messages/messages'),
    gameState = require('./gameState').create(),
    cardType = require('./gameState').CardType;

function handlePageLoad() {
    secureCb = document.getElementById("secureCb");
    secureCb.checked = false;
    secureCb.onclick = toggleTls;

    secureCbLabel = document.getElementById("secureCbLabel");

    wsUri = document.getElementById("wsUri");
    toggleTls();

    connectBut = document.getElementById("connect");
    connectBut.onclick = doConnect;

    disconnectBut = document.getElementById("disconnect");
    disconnectBut.onclick = doDisconnect;

    let cardTypeRadios = document.getElementsByName('cardType');
    for (let i = 0; i < cardTypeRadios.length; i++) {
        cardTypeRadios[i].onclick = function () {
            gameState.cardType = cardType[this.value];
            drawPlayedCards();
            drawCardsInHand();
        };
    }

    document.getElementById("choosePlayerName").addEventListener('click', () => {
        let playerName = document.getElementById('playerName').value,
            message = JSON.stringify(messages.create(messages.MessageType.CHOOSE_PLAYER_NAME, playerName));
        websocket.send(message);

        logToConsole("SENT: " + message);
    });

    document.getElementById("chooseTrumpf").addEventListener('click', () => {
        let mode = document.getElementById('mode').value,
            trumpfColor = document.getElementById('trumpfColor').value,
            message = JSON.stringify(messages.create(messages.MessageType.CHOOSE_TRUMPF, {
                mode,
                trumpfColor
            }));
        websocket.send(message);

        logToConsole("SENT: " + message);
    });

    document.getElementById("chooseCard").addEventListener('click', () => {
        let number = Number(document.getElementById('number').value),
            color = document.getElementById('color').value,
            message = JSON.stringify(messages.create(messages.MessageType.CHOOSE_CARD, {
                number,
                color
            }));
        websocket.send(message);

        logToConsole("SENT: " + message);
    });

    consoleLog = document.getElementById("consoleLog");

    document.getElementById("clearLogBut").addEventListener('click', () => {
        removeAllChildren(consoleLog);
    });

    setGuiConnected(false);

    document.getElementById("disconnect").onclick = doDisconnect;

}

function toggleTls() {
    if (wsUri.value === "") {
        wsUri.value = "ws://" + window.location.host;
    }

    if (secureCb.checked) {
        wsUri.value = wsUri.value.replace("ws:", "wss:");
    } else {
        wsUri.value = wsUri.value.replace("wss:", "ws:");
    }
}

function doConnect() {
    if (window.MozWebSocket) {
        logToConsole('<span style="color: red;"><strong>Info:</strong> This browser supports WebSocket using the MozWebSocket constructor</span>');
        window.WebSocket = window.MozWebSocket;
    } else if (!window.WebSocket) {
        logToConsole('<span style="color: red;"><strong>Error:</strong> This browser does not have support for WebSocket</span>');
        return;
    }

    // prefer text messages
    let uri = wsUri.value;
    if (uri.indexOf("?") == -1) {
        uri += "?encoding=text";
    } else {
        uri += "&encoding=text";
    }
    websocket = new WebSocket(uri);
    websocket.onopen = function (evt) {
        onOpen(evt);
    };
    websocket.onclose = function (evt) {
        onClose(evt);
    };
    websocket.onmessage = function (evt) {
        onMessage(evt);
    };
    websocket.onerror = function (evt) {
        onError(evt);
    };
}

function doDisconnect() {
    websocket.close();
}

function doSend() {
    logToConsole("SENT: " + sendMessage.value);
    websocket.send(sendMessage.value);
}

function logToConsole(message) {
    let pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    consoleLog.appendChild(pre);

    while (consoleLog.childNodes.length > 50) {
        consoleLog.removeChild(consoleLog.firstChild);
    }

    consoleLog.scrollTop = consoleLog.scrollHeight;
}

function onOpen() {
    logToConsole("CONNECTED");
    setGuiConnected(true);
}

function onClose() {
    logToConsole("DISCONNECTED");
    setGuiConnected(false);
}

function onMessage(evt) {
    let message = JSON.parse(evt.data);

    if (message.type) {
        switch (message.type) {
            case messages.MessageType.DEAL_CARDS:
                handleDealCards(message.data);
                break;
            case messages.MessageType.REQUEST_CARD:
                handleRequestCard();
                break;
            case messages.MessageType.REJECT_CARD:
                handleRejectCard();
                break;
            case messages.MessageType.PLAYED_CARDS:
                handlePlayedCards(message.data);
                break;
        }
    }

    logToConsole('<span style="color: red;">RESPONSE: ' + evt.data + '</span>');
}

function handleDealCards(cards) {
    gameState.setCardsInHand(cards);
    drawCardsInHand();
}

function handleRequestCard() {
    gameState.yourTurn = true;
}

function handleRejectCard() {
    alert('The card you played is invalid!');
}

function handlePlayedCards(playedCards) {
    gameState.playedCards = playedCards;
    gameState.removeLastCardPlayed();
    drawCardsInHand();
    drawPlayedCards();
}

function drawPlayedCards() {
    if (gameState.playedCards) {
        removeAllChildrenOnAllElements(document.querySelectorAll('#cardsPlayed div'));

        gameState.playedCards.forEach((playedCard, index) => {
            addCardToDom(document.getElementById('player' + index), playedCard);
        });
    }
}

function drawCardsInHand() {
    let cardsInHandBlock = document.getElementById('cardsInHand');
    removeAllChildren(cardsInHandBlock);

    gameState.cardsInHand.forEach((card) => {
        addCardToDom(cardsInHandBlock, card, playCard.bind(undefined, card));
    });
}

function addCardToDom(node, card, onClick) {
    let cardImage = document.createElement('img');
    cardImage.src = 'images/cards/' + gameState.cardType + '/' + card.color + "_" + card.number + ".gif";

    if (onClick) {
        cardImage.onclick = onClick;
    }

    node.appendChild(cardImage);
}

function playCard(card) {
    gameState.lastCardPlayed = card;

    let message = JSON.stringify(messages.create(messages.MessageType.CHOOSE_CARD, card));
    websocket.send(message);

    logToConsole("SENT: " + message);
}

function removeAllChildren(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

function removeAllChildrenOnAllElements(nodes) {
    for(let i = 0; i < nodes.length; i++) {
        removeAllChildren(nodes[i]);
    }
}

function onError(evt) {
    logToConsole('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function setGuiConnected(isConnected) {
    wsUri.disabled = isConnected;
    connectBut.disabled = isConnected;
    disconnectBut.disabled = !isConnected;
    secureCb.disabled = isConnected;
    let labelColor = "black";
    if (isConnected) {
        labelColor = "#999999";
    }
    secureCbLabel.style.color = labelColor;

}

window.addEventListener("load", handlePageLoad, false);