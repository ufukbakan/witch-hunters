const { Server } = require('socket.io');
const { createRoom, joinRoomWithId } = require('./src/rooms');

const io = require('socket.io')({
    cors: {
        origin: ["http://localhost", "http://localhost:80"],
        methods: "*",
    },
    allowEIO3: true,
});

io.listen(9099);

io.on('connection', client => {
    client.on("request-create-room", (msg)=>{
        client.emit("room-created", createRoom());
    });
    client.on("join-request", (msg) => {
        const {roomid, username} = msg;
        console.log({roomid, username});
        client.emit("join-response", joinRoomWithId(roomid, client, username));
    })
});

function shutdown(){
    io.close();    
}

module.exports = {
    shutdown
}