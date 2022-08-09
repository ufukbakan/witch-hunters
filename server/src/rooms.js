const { prcTimeout, prcInterval } = require("precision-timeout-interval");
const { Socket } = require("socket.io");
const { ProcessResult } = require("./globalTypes");

/** @type {Array<Room>} */ let rooms = [];

/**
 * @typedef Player
 * @property {Socket} socket
 * @property {string} username
 * @property {number} score
 */

class JoinResponse {
    /**
     * @param {ProcessResult} result
     * @param {String} message
     */
    constructor(result, message) {
        this.result = result;
        this.message = message;
    }
}

class Room {

    constructor(id) {
        this.id = id;
        /**@type {Array<Player>} */ this.players = [];
        this.witchId = 0;
        this.aliveWitches = [];
        this.gameFlow = false;
        this.inactiveTimer = prcInterval(60000 * 5, () => this.closeTheRoom());
        console.log("The room " + this.id + " is created");
    }

    closeTheRoom() {
        this.inactiveTimer.end = true;
        console.log("Closing the room " + this.id);
        this.players.forEach(p => {
            p.socket.emit("room-is-closed", true);
        });
        removeTheRoom(this.id);
        this.players = undefined;
        this.witchId = undefined;
        this.aliveWitches = undefined;
        this.gameFlow = undefined;
        this.inactiveTimer = undefined;
    }

    resetActiveTimer() {
        console.log("Resetting the activity timer " + this.id);
        let oldTimer = this.inactiveTimer;
        oldTimer.end = true;
        this.inactiveTimer = prcInterval(oldTimer.interval, oldTimer.callback);
        oldTimer.callback = undefined;
    }

    joinPlayer(clientSocket, username) {
        this.resetActiveTimer();
        if (this.players.length < 2) {
            this.players.push({
                socket: clientSocket,
                username,
                score: 0
            });
            if (this.players.length == 2) {
                this.warnPlayers();
                prcTimeout(4000, () => this.startTheGame());
            }
            clientSocket.on("disconnect", () => {
                console.log("A player disconnected from " + this.id);
                if (this.players) {
                    this.players = this.players.filter(p => p.socket != clientSocket);
                    this.finishGame();
                }
            });
            clientSocket.on("pop-witch", (id) => {
                const idx = this.aliveWitches.indexOf(id);
                if (idx >= 0) {
                    this.aliveWitches.splice(idx, 1);
                    const popper = this.players.find(p => p.socket == clientSocket);
                    popper.score += 10;
                    const otherPlayer = this.players.find(p => p.socket != clientSocket);
                    otherPlayer.socket.emit("enemy-pop", id);
                    this.players.forEach(p => {
                        p.socket.emit("update-score", this.players.map(p => {
                            return { username: p.username, score: p.score }
                        }));
                    });
                    if (this.players.find(p => p.score >= 450)) {
                        this.finishGame();
                    } else {
                        this.generateEnoughWitches();
                    }
                }
            });
            console.log(username + " has joined to " + this.id);
            return new JoinResponse(ProcessResult.SUCCESS, "");
        }
        console.log("Player couldnt join");
        return new JoinResponse(ProcessResult.FAIL, "The room is FULL");
    }

    finishGame() {
        this.aliveWitches = [];
        this.witchId = 0;
        this.gameFlow = false;
        this.players.forEach(p => {
            p.socket.emit("end-game", true);
            p.score = 0;
        });
    }

    generateEnoughWitches() {
        let thereShouldBe = Math.floor((this.witchId + 20) / 10);
        let remaining = thereShouldBe - this.aliveWitches.length;
        if (remaining > 0) {
            this.genererateWitches(remaining);
        }
    }

    warnPlayers() {
        this.resetActiveTimer();
        console.log("game is ready " + this.id);
        this.players.forEach(p => {
            p.socket.emit("game-is-ready", this.players.map(p => {
                return { username: p.username, score: p.score }
            }));
        });
    }

    startTheGame() {
        this.resetActiveTimer();
        console.log("game is starting " + this.id);
        this.gameFlow = true;
        this.genererateWitches(2);
    }

    genererateWitches(n) {
        for (let i = 0; i < n; i++) {
            const tempWitch = this.randomWitch();
            this.aliveWitches.push(tempWitch.id);
            this.players.forEach(p => {
                p.socket.emit("spawn-witch", tempWitch);
            });
        }
    }

    randomWitch() {
        return {
            id: this.witchId++,
            posX: Math.round(Math.random() * 850),
            posY: Math.round(Math.random() * 500),
            speed: Math.round((Math.random() * 3) + 5 + (this.witchId / 5)),
            direction: Math.random() * Math.PI * 2
        }
    }
}

/**
 * 
 * @param {number} length 
 * @returns {string}
 */
function generateRoomId(length = 4) {

    let alphaInterval = [65, 90];
    let numericInterval = [48, 57];
    let generatedId = "";
    for (let i = 0; i < length; i++) {
        if (Math.random() > 0.5) {
            generatedId += String.fromCharCode(Math.round(Math.random() * (alphaInterval[1] - alphaInterval[0]) + alphaInterval[0]))
        } else {
            generatedId += String.fromCharCode(Math.round(Math.random() * (numericInterval[1] - numericInterval[0]) + numericInterval[0]))
        }
    }
    if (checkCollision(generatedId)) {
        return generateRoomId(length + 1);
    }
    return generatedId;
}

function checkCollision(id) {
    if (rooms.find(e => e.id == id)) {
        return true;
    }
    return false;
}

function createRoom() {
    let id = generateRoomId();
    rooms.push(new Room(id));
    return id;
}

function joinRoomWithId(roomid, clientSocket, username) {
    const room = rooms.find(r => r.id == roomid);
    if (room) {
        return room.joinPlayer(clientSocket, username);
    }
    return new JoinResponse(ProcessResult.FAIL, "Room does not exist");
}

/**
 * 
 * @param {string} id 
 */
function removeTheRoom(id) {
    rooms = rooms.filter(e => e.id != id);
}

module.exports = {
    Room,
    createRoom,
    joinRoomWithId
}