'use strict';

let secureCb,
    secureCbLabel,
    wsUri,
    consoleLog,
    connectBut,
    disconnectBut,
    clearLogBut,
    websocket,
    messages = require('../../../shared/messages/messages');

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

    document.getElementById("choosePlayerName").addEventListener('click', () => {
        let playerName = document.getElementById('playerName').value,
            message = JSON.stringify(messages.create(messages.MessageType.CHOOSE_PLAYER_NAME, playerName));
        websocket.send(message);

        logToConsole("SENT: " + message);
    });

    document.getElementById("chooseTrumpf").addEventListener('click', () => {
        let mode = document.getElementById('mode').value,
            trumpfColor  = document.getElementById('trumpfColor').value,
            message = JSON.stringify(messages.create(messages.MessageType.CHOOSE_TRUMPF, {
                mode,
                trumpfColor
            }));
        websocket.send(message);

        logToConsole("SENT: " + message);
    });

    document.getElementById("chooseCard").addEventListener('click', () => {
        let number = document.getElementById('number').value,
            color  = document.getElementById('color').value,
            message = JSON.stringify(messages.create(messages.MessageType.CHOOSE_CARD, {
                number,
                color
            }));
        websocket.send(message);

        logToConsole("SENT: " + message);
    });

    consoleLog = document.getElementById("consoleLog");

    document.getElementById("clearLogBut").addEventListener('click', () => {
        while (consoleLog.childNodes.length > 0) {
            consoleLog.removeChild(consoleLog.lastChild);
        }
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
    logToConsole('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
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