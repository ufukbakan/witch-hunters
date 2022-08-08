import './app.css'
import Game from './components/Game'
import Login from './components/Login'
import io from "socket.io-client"
import PreloadAssets from './utilities/PreloadAssets';

const SERVER_PORT = 9092;
const wsurl = "ws://"+ location.host +":"+SERVER_PORT;
export const clientSocket = io(wsurl, {
  transports: ["websocket"],
  secure: true
});

export function App() {

  return (
    <>
      <Game></Game>
      <Login></Login>
    </>
  )
}
