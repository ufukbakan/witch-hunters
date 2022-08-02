import { useEffect, useState } from "preact/hooks";
import { clientSocket } from "../app";

export default function () {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("username");
    const [currentRoomId, setCurrentRoomId] = useState("");

    useEffect(() => {
        clientSocket.off("room-created");
        clientSocket.on("room-created", (roomid) => {
            setCurrentRoomId(roomid);
            clientSocket.emit("join-request", { roomid: roomid, username: username });
        });
    });

    function createGameRoom() {
        clientSocket.emit("request-create-room");
    }

    function joinRoom() {
        clientSocket.emit("join-request", { roomid: roomId, username: username });
    }

    function testFunction(){
        console.log(username);
    }

    return (
        <div>
            <h2>{currentRoomId}</h2>
            <button onClick={testFunction}>test</button>
            <button onClick={createGameRoom}>Create Room</button>
            <button onClick={joinRoom}>Join Room</button>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" id="room-id-input" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
        </div>
    )
}