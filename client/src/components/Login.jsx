import { useContext, useEffect, useState } from "preact/hooks";
import { clientSocket, GameContext } from "../app";
import { resetSocket } from "./Game";

export default function () {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("username");
    const [gameContext, setGameContext] = useContext(GameContext);

    useEffect(() => {
        clientSocket.off("room-created");
        clientSocket.on("room-created", (roomid) => {
            setGameContext({...gameContext, "currentRoomId": roomid});
            clientSocket.emit("join-request", { roomid: roomid, username: username });
        });

    });

    function createGameRoom() {
        resetSocket();
        clientSocket.emit("request-create-room");
    }

    function joinRoom() {
        resetSocket();
        clientSocket.emit("join-request", { roomid: roomId, username: username });
    }

    function testFunction(){
        console.log(username);
    }

    return (
        <div>
            <h2>{gameContext.currentRoomId}</h2>
            <button onClick={testFunction}>test</button>
            <button onClick={createGameRoom}>Create Room</button>
            <button onClick={joinRoom}>Join Room</button>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Room ID" id="room-id-input" value={roomId} onChange={(e) => setRoomId(e.target.value.toLocaleUpperCase() )} />
        </div>
    )
}