'use strict';

let secureCb,
    secureCbLabel,
    wsUri,
    consoleLog,
    connectBut,
    disconnectBut,
    websocket,
    messages = require('../../../shared/messages/messages'),
    gameState = require('./gameState').create(),
    cardType = require('./gameState').CardType,
    SessionChoice = require('../../../shared/game/sessionChoice'),
    spectatorTimeout,
    sessionChoiceBut;


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


    sessionChoiceBut = document.getElementById("chooseSessionBtn");
    sessionChoiceBut.onclick = doChooseSession;

    let cardTypeRadios = document.getElementsByName('cardType');
    for (let i = 0; i < cardTypeRadios.length; i++) {
        cardTypeRadios[i].onclick = function () {
            gameState.cardType = cardType[this.value];
            drawPlayedCards();
            drawCardsInHand();
            drawTrumpfIcon();
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


function applyMessageToUI(message) {
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
            case messages.MessageType.BROADCAST_STICH:
                handleBroadcastStich(message.data);
                break;
            case messages.MessageType.REQUEST_SESSION_CHOICE:
                handleRequestSessionChoice(message.data);
                break;
            case messages.MessageType.BROADCAST_TRUMPF:
                handleBroadcastTrumpf(message.data);
                break;
            case messages.MessageType.BROADCAST_TEAMS:
                handleBroadcastTeams(message.data);
                break;
        }
    }
}

function handleBroadcastTeams(teams) {
    let seatArray = ['first', 'third', 'second', 'fourth'],
        index = 0;

    teams.forEach((team) => {
        team.players.forEach((player) => {
            let playerName = document.createElement('span');
            playerName.classList.add(seatArray[index++]);
            playerName.innerHTML = player.name;
            document.getElementById('cardsPlayed').appendChild(playerName);
        });
    });
}

function drawTrumpfIcon() {
    if (gameState.trumpf) {
        switch (gameState.trumpf.mode) {
            case 'TRUMPF':
                let trumpfImage = document.createElement('img');
                trumpfImage.src = 'images/trumpf/' + gameState.cardType + '/' + gameState.trumpf.trumpfColor.toLowerCase() + ".png";

                let trumpfHolder = document.getElementById('trumpfHolder');
                removeAllChildren(trumpfHolder);
                trumpfHolder.appendChild(trumpfImage);
        }
    }
}
function handleBroadcastTrumpf(trumpf) {
    gameState.trumpf = trumpf;
    drawTrumpfIcon();
}


function isSpectatorRelevantMessage(message) {
    switch (message.type) {
        case messages.MessageType.PLAYED_CARDS:
        case messages.MessageType.BROADCAST_STICH:
        case messages.MessageType.CHOOSE_TRUMPF:
        case messages.MessageType.BROADCAST_WINNER_TEAM:
            return true;
        default:
            return false;
    }
}

function calculateDelayToMillis() {
    return (1.0 / (spectatorTimeout + 1)) * 500;
}

function stepForward() {
    if (gameState.currentSpectatorIndex < gameState.spectatorRelevantSteps.length) {
        let message = gameState.spectatorRelevantSteps[gameState.currentSpectatorIndex];
        ++gameState.currentSpectatorIndex;
        if (message) {
            applyMessageToUI(message);
            if (message.type === messages.MessageType.BROADCAST_WINNER_TEAM) {
                console.log('Spiel vorbei, ' + message.data.name + ' gewinnt mit ' + message.data.points + ' Punkten');
            }
        }
    }
    let delay = calculateDelayToMillis(spectatorTimeout);
    setTimeout(stepForward, delay);
}

function bindSpectatorControls() {
    gameState.currentSpectatorIndex = 0;
    document.getElementById('specatorControls').style.display = 'block';

    document.getElementById('spectatorSpeed').addEventListener('input', (evt) => {
        spectatorTimeout = parseInt(evt.target.value);
    });

    spectatorTimeout = parseInt(document.getElementById('spectatorSpeed').value);


    stepForward();
}

function onMessage(evt) {
    let message = JSON.parse(evt.data);

    logToConsole('<span style="color: red;">RESPONSE: ' + evt.data + '</span>');

    if (gameState.isSpectator && isSpectatorRelevantMessage(message)) {
        gameState.spectatorRelevantSteps.push(message);
        if (gameState.spectatorRelevantSteps.length === 1) {
            bindSpectatorControls();
        }
    } else {
        applyMessageToUI(message);
    }
}

function doChooseSession() {
    let sessionChoice = document.querySelector('input[name=sessionChoice]:checked').value;
    let sessionName;
    switch (sessionChoice) {
        case SessionChoice.AUTOJOIN:
            break;
        case SessionChoice.CREATE_NEW:
            sessionName = document.getElementById('createNewSessionText').value;
            break;
        case SessionChoice.JOIN_EXISTING:
            sessionName = document.getElementById('joinExistingSelect').value;
            break;
        case SessionChoice.SPECTATOR:
            sessionName = document.getElementById('useAsSpectatorText').value;
            gameState.isSpectator = true;
            gameState.spectatorRelevantSteps = [];
            break;
    }

    let message = JSON.stringify(messages.create(messages.MessageType.CHOOSE_SESSION, sessionChoice, sessionName));
    websocket.send(message);
    logToConsole("SENT: " + message);
}

function handleRequestSessionChoice(availableSessions) {
    let sessionSelect = document.getElementById('joinExistingSelect');
    availableSessions.forEach((element) => {
        sessionSelect.appendChild(new Option(element,element));
    });
}

function handleBroadcastStich(stich) {
    gameState.startingPlayerIndex = stich.id;
    document.getElementById('player' + gameState.startingPlayerIndex).classList.add('stichMade');
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
    document.getElementById('player' + gameState.startingPlayerIndex).classList.remove('stichMade');
    gameState.playedCards = playedCards;
    gameState.removeLastCardPlayed();
    drawCardsInHand();
    drawPlayedCards();
}

function drawPlayedCards() {
    if (gameState.playedCards) {
        removeAllChildrenOnAllElements(document.querySelectorAll('#cardsPlayed div:not(#trumpfHolder)'));

        let playerIndex = gameState.startingPlayerIndex;
        for (let i = 0; i < gameState.playedCards.length; i++) {
            playerIndex = (gameState.startingPlayerIndex + i) % 4;
            let card = gameState.playedCards[i];
            addCardToDom(document.getElementById('player' + playerIndex), card);
        }
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
    cardImage.src = 'images/cards/' + gameState.cardType + '/' + card.color.toLowerCase() + "_" + card.number + ".gif";

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
    for (let i = 0; i < nodes.length; i++) {
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