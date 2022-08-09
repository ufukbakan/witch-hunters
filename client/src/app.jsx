import './app.css'
import Game from './components/Game'
import Login from './components/Login'
import io from "socket.io-client"
import PreloadAssets from './utilities/PreloadAssets';
import { createContext } from 'preact';
import { useState } from 'preact/hooks';

const SERVER_PORT = 9092;
const wsurl = "ws://"+ location.host +":"+SERVER_PORT;
export const clientSocket = io(wsurl, {
  transports: ["websocket"],
  secure: true
});

export const GameContext = createContext();

export function App() {

  const [gameContext, setGameContext] = useState({"currentRoomId": null});

  return (
    <GameContext.Provider value={[gameContext, setGameContext]}>
      <Game></Game>
      <Login></Login>
    </GameContext.Provider>
  )
}
