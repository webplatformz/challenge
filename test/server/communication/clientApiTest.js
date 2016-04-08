'use strict';

import {expect} from 'chai';
import WebSocket from 'ws';
import ClientApi from '../../../server/communication/clientApi.js';
import GameType from '../../../server/game/gameType.js';
import {GameMode} from '../../../shared/game/gameMode.js';
import CardColor from '../../../shared/deck/cardColor';
import CloseEventCode from '../../../server/communication/closeEventCode.js';
import sinon from 'sinon';
import messages from '../../../shared/messages/messages.js';
import {MessageType} from '../../../shared/messages/messageType.js';
import {SessionChoice} from '../../../shared/session/sessionChoice.js';
import Logger from '../../../server/logger';

let WebSocketServer = WebSocket.Server;

describe('Client API', () => {

    let wss,
        clientApi;

    beforeEach(() => {
        wss = new WebSocketServer({port: 10001});
        clientApi = ClientApi.create();
    });

    afterEach(() => {
        wss.close();
    });

    describe('addClient', () => {
        let webSocket;

        beforeEach(() => {
            webSocket = {
                on: () => {
                }
            };
        });

        it('should add given client to clients array', () => {
            clientApi.addClient(webSocket);

            expect(clientApi.clients[0]).to.equal(webSocket);
        });

        it('should reject promise and remove client on close event', (done) => {
            let disconnectMessage = 'message';
            let webSocket1 = new WebSocket('ws://localhost:10001');
            let webSocket2 = new WebSocket('ws://localhost:10001');
            let webSocket3 = new WebSocket('ws://localhost:10001');

            clientApi.addClient(webSocket1);
            let promise = clientApi.addClient(webSocket2);
            clientApi.addClient(webSocket3);

            webSocket3.on('open', () => {
                setTimeout(() => {
                    webSocket2.close(CloseEventCode.NORMAL, disconnectMessage);
                }, 10);
            });

            promise.then(() => {
                done(new Error('This promise should never resolve'));
            }, ({code, message}) => {
                expect(code).to.equal(CloseEventCode.NORMAL);
                expect(message).to.equal(disconnectMessage);

                expect(clientApi.clients).to.have.length(2);
                expect(clientApi.clients[0]).to.equal(webSocket1);
                expect(clientApi.clients[1]).to.equal(webSocket3);
                done();
            }).catch(done);
        });
    });

    describe('removeClient', () => {
        it('should remove given client from clients array', () => {
            let webSocket = {
                    close: () => {}
                },
                webSocket2 = {
                    close: () => {}
                };

            clientApi.addClient(webSocket);
            clientApi.addClient(webSocket2);

            clientApi.removeClient(webSocket);

            expect(clientApi.clients).to.have.length(1);
            expect(clientApi.clients[0]).to.equal(webSocket2);
        });

        it('should close connection with given code and message if readyState OPEN', () => {
            let webSocket = {
                    close: sinon.spy(),
                    readyState: 1
                },
                message = 'message';

            clientApi.addClient(webSocket);

            clientApi.removeClient(webSocket, message);

            expect(webSocket.close.withArgs(CloseEventCode.NORMAL, message).calledOnce).to.equal(true);
        });

        it('should not close connection with given code and message when readyState not OPEN', () => {
            let webSocket = {
                    close: sinon.spy(),
                    readyState: 2
                },
                message = 'message';

            clientApi.addClient(webSocket);

            clientApi.removeClient(webSocket, message);

            expect(webSocket.close.callCount).to.equal(0);
        });
    });

    describe('requestPlayerName', () => {
        it('should wait for choosePlayerName', (done) => {
            let choosePlayerName = messages.create(MessageType.CHOOSE_PLAYER_NAME.name, 'Hans');

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestPlayerName(client).then((data) => {
                    expect(data.playerName).to.equal(choosePlayerName.data.playerName);
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === MessageType.REQUEST_PLAYER_NAME.name) {
                    client.send(JSON.stringify(choosePlayerName));
                }
            });
        });

        it('should reject invalid answer messages', (done) => {
            let clientAnswer = messages.create(MessageType.PLAYED_CARDS.name, ['a', 'b', 'c']);

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestPlayerName(client).then(() => done(new Error('Should not resolve'))).catch((data) => {
                    expect(data).to.equal('Invalid Message: ' + JSON.stringify(clientAnswer) + ', expected message with type: CHOOSE_PLAYER_NAME');
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            new Promise((resolve) => {
                client.on('message', (message) => {
                    message = JSON.parse(message);

                    if (message.type === MessageType.REQUEST_PLAYER_NAME.name) {
                        client.send(JSON.stringify(clientAnswer));
                    } else if (message.type === MessageType.BAD_MESSAGE.name) {
                        resolve();
                    }
                });
            }).then(done, done);
        });

        it('should reject empty answer messages', (done) => {
            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestPlayerName(client).then(() => done(new Error('Should not resolve'))).catch((data) => {
                    expect(data).to.equal('Invalid Message: , expected message with type: CHOOSE_PLAYER_NAME');
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === MessageType.REQUEST_PLAYER_NAME.name) {
                    client.send(undefined);
                }
            });
        });

        it('should reject wrong data type', (done) => {
            let clientAnswer = messages.create(MessageType.CHOOSE_PLAYER_NAME.name, 13);

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestPlayerName(client).then(() => done(new Error('Should not resolve'))).catch((data) => {
                    expect(data.data).to.eql(['Data has an incorrect length']);
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            new Promise((resolve) => {
                client.on('message', (message) => {
                    message = JSON.parse(message);

                    if (message.type === MessageType.REQUEST_PLAYER_NAME.name) {
                        client.send(JSON.stringify(clientAnswer));
                    } else if (message.type === MessageType.BAD_MESSAGE.name) {
                        resolve();
                    }
                });
            }).then(done, done);
        });
    });

    describe('broadcastTeams', () => {
        it('should send the teams message to all clients', (done) => {
            let clients,
                clientPromises = [],
                teamsMessage = [];

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastTeams(teamsMessage);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(MessageType.BROADCAST_TEAMS.name);
                        expect(message.data).to.eql(teamsMessage);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });

    describe('dealCards', () => {
        it('should deal cards to given client', (done) => {
            let cards = ['a', 'b', 'c'];

            wss.on('connection', (client) => {
                clientApi.addClient(client);
                clientApi.dealCards(client, cards);
            });

            let client = new WebSocket('ws://localhost:10001');

            new Promise((resolve) => {
                client.on('message', (message) => {
                    message = JSON.parse(message);

                    expect(message.type).to.equal(MessageType.DEAL_CARDS.name);
                    expect(message.data).to.eql(cards);

                    resolve();
                });
            }).then(() => done()).catch(done);
        });
    });

    describe('requestTrumpf', () => {
        it('should wait for chooseTrumpf', (done) => {
            let chooseTrumpf = messages.create(MessageType.CHOOSE_TRUMPF.name, {mode: GameMode.TRUMPF, trumpfColor: CardColor.SPADES});

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestTrumpf(client, false).then((data) => {
                    expect(data).to.eql(chooseTrumpf.data);
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === MessageType.REQUEST_TRUMPF.name) {
                    client.send(JSON.stringify(chooseTrumpf));
                }
            });
        });
    });

    describe('rejectTrumpf', () => {
        it('should reject trumpf to given client', (done) => {
            let gameType = GameType.create(GameMode.SCHIEBE);

            wss.on('connection', (client) => {
                clientApi.addClient(client);
                clientApi.rejectTrumpf(client, gameType);
            });

            let client = new WebSocket('ws://localhost:10001');

            new Promise((resolve) => {
                client.on('message', (message) => {
                    message = JSON.parse(message);

                    expect(message.type).to.equal(MessageType.REJECT_TRUMPF.name);
                    expect(message.data.mode).to.equal(gameType.mode);

                    resolve();
                });
            }).then(() => done()).catch(done);
        });
    });

    describe('broadcastStich', () => {
        it('should send the stich message to all clients', (done) => {
            let clients,
                clientPromises = [],
                stichMessage = {name: 'hans'};

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastStich(stichMessage);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(MessageType.BROADCAST_STICH.name);
                        expect(message.data).to.eql(stichMessage);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });

    describe('broadcastPlayedCards', () => {
        it('should send played cards to all clients', (done) => {
            let clients,
                playedCards = ['a', 'b', 'c'],
                clientPromises = [];

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastCardPlayed(playedCards);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(MessageType.PLAYED_CARDS.name);
                        expect(message.data).to.eql(playedCards);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });

    describe('broadcastTrumpf', () => {
        it('should send chosen Trumpf to all clients', (done) => {
            let clients,
                gameType = GameType.create(GameMode.TRUMPF, CardColor.SPADES),
                clientPromises = [];

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastTrumpf(gameType);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(MessageType.BROADCAST_TRUMPF.name);
                        expect(message.data).to.eql(gameType);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });

    describe('requestCard', () => {
        it('should wait for chooseCard', (done) => {
            let chooseCard = messages.create(MessageType.CHOOSE_CARD.name, {number: 11, color: CardColor.SPADES}),
                cardsOnTable = ['a', 'b'];

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestCard(client, cardsOnTable).then((data) => {
                    expect(data.card).to.equal(chooseCard.data.card);
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            client.on('message', (message) => {
                message = JSON.parse(message);

                if (message.type === MessageType.REQUEST_CARD.name) {
                    client.send(JSON.stringify(chooseCard));
                }
            });
        });
    });

    describe('rejectCard', () => {
        it('should reject card to given client', (done) => {
            let cardsOnTable = ['c', 'b'],
                card = 'e';

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.rejectCard(client, card, cardsOnTable);
            });

            let client = new WebSocket('ws://localhost:10001');

            new Promise((resolve) => {
                client.on('message', (message) => {
                    message = JSON.parse(message);

                    expect(message.type).to.equal(MessageType.REJECT_CARD.name);
                    resolve();
                });
            }).then(done, done);
        });
    });

    describe('requestSessionChoice', () => {
        it('should request session to join from client', (done) => {
            let availableSessions = ['Session 1', 'Session2', 'Session 3'],
                sessionName = 'sessionName',
                chooseSession = {
                    type: MessageType.CHOOSE_SESSION.name,
                    data: {
                        sessionChoice: SessionChoice.CREATE_NEW,
                        sessionName
                    }
                };

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                clientApi.requestSessionChoice(client, availableSessions).then((data) => {
                    expect(data.sessionChoice).to.equal(SessionChoice.CREATE_NEW);
                    expect(data.sessionName).to.equal(sessionName);
                    done();
                }).catch(done);
            });

            let client = new WebSocket('ws://localhost:10001');

            new Promise(() => {
                client.on('message', (message) => {
                    message = JSON.parse(message);

                    expect(message.type).to.equal(MessageType.REQUEST_SESSION_CHOICE.name);
                    expect(message.data).to.eql(availableSessions);
                    client.send(JSON.stringify(chooseSession));
                });
            }).catch(done);
        });
    });


    describe('closeAll', () => {
        it('should gracefully close all clients with given message', (done) => {
            let connectedClients = 0,
                disconnectMessage = 'disconnect due to failing bot',
                expectCodeAndMessage = (resolve, code, message) => {
                    expect(code).to.equal(CloseEventCode.NORMAL);
                    expect(message).to.equal(disconnectMessage);
                    resolve();
                };

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (++connectedClients === 2) {
                    setTimeout(() => {
                        clientApi.closeAll(disconnectMessage);
                    }, 10);
                }
            });

            let client1 = new WebSocket('ws://localhost:10001');
            let client2 = new WebSocket('ws://localhost:10001');

            Promise.all([
                new Promise((resolve) => {
                    client1.on('close', expectCodeAndMessage.bind(null, resolve));
                }),
                new Promise((resolve) => {
                    client2.on('close', expectCodeAndMessage.bind(null, resolve));
                })
            ]).then(() => {
                expect(client1.readyState).to.equal(WebSocket.CLOSED);
                expect(client2.readyState).to.equal(WebSocket.CLOSED);
                done();
            }).catch(done);
        });
    });

    describe('broadcastSessionJoined', () => {
        it('should send the sessionname, player already joined players to all client', (done) => {
            let clients,
                clientPromises = [],
                sessionName = 'sessionName',
                playersInSession = [
                    {
                        name: 'name1',
                        id: 'id1'
                    },
                    {
                        name: 'name2',
                        id: 'ide2'
                    }
                ],
                sessionJoinedMessage = {
                    sessionName: sessionName,
                    player: {
                        name: playersInSession[1].name,
                        id: playersInSession[1].id
                    },
                    playersInSession: playersInSession
                };

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastSessionJoined(sessionName, playersInSession[1], playersInSession);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(MessageType.BROADCAST_SESSION_JOINED.name);
                        expect(message.data).to.eql(sessionJoinedMessage);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });

    describe('broadcastTournamentRankingTable', () => {
        it('should send the sessionname, player already joined players to all client', (done) => {
            let clients,
                clientPromises = [],
                sessionName = 'sessionName',
                rankingTable = 'rankingTable';

            wss.on('connection', (client) => {
                clientApi.addClient(client);

                if (clientApi.clients.length === clients.length) {
                    clientApi.broadcastTournamentRankingTable(rankingTable);
                }
            });

            clients = [new WebSocket('ws://localhost:10001'), new WebSocket('ws://localhost:10001')];

            clients.forEach((client) => {
                clientPromises.push(new Promise((resolve) => {
                    client.on('message', (message) => {
                        message = JSON.parse(message);

                        expect(message.type).to.equal(MessageType.BROADCAST_TOURNAMENT_RANKING_TABLE.name);
                        expect(message.data).to.eql(rankingTable);

                        resolve();
                    });
                }));
            });

            Promise.all(clientPromises).then(() => {
                done();
            }).catch(done);
        });
    });

    describe('close', () => {
        it('should close websocket with given message', () => {
            let webSocket = {
                close: sinon.spy()
            };

            clientApi.close(webSocket, 'message');

            expect(webSocket.close.callCount).to.equal(1);
        });

        it('should handle exception from websocket', () => {
            let webSocket = {
                close() {
                    throw new Error('testError');
                }
            };
            let errorSpy = sinon.spy(Logger, 'error');

            clientApi.close(webSocket, 'message');

            expect(errorSpy.callCount).to.equal(1);
        });
    });
});
