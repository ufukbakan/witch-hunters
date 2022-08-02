import { useEffect, useState } from "preact/hooks";
import { prcInterval, prcIntervalWithDelta, prcTimeout } from "precision-timeout-interval";
import Witch, { WitchStates } from "../characters/Witch";
import { createParticles, Particle } from "../utilities/ParticleHelper";
import background from "../assets/background.png";
import Login from "./Login";
import { clientSocket } from "../app";

export const CANVAS_WIDTH = 896;
export const CANVAS_HEIGHT = 504;
export const FPS = 60;
/**@type {Array<Witch>} */ const mobs = [];
/**@type {Array<Particle>} */ let yellowParticles = [];
/**@type {Array<Particle>} */ let redParticles = [];

export default function (props) {
    const [myScore, setMyScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [gameFlow, setGameFlow] = useState(false);
    const [scores, setScores] = useState([{username: "p1", score: 0}, {username: "p2", score: 0}]);
    const backgroundImage = new Image();
    const [countdown, setCountdown] = useState(0);
    backgroundImage.src = background;

    let /**@type {CanvasRenderingContext2D} */ canvasContext;

    useEffect(
        () => {
            canvasContext = document.getElementById("game-canvas").getContext("2d");
            prcIntervalWithDelta(1000 / FPS, gameLoop);

            clientSocket.on("spawn-witch", (msg) => {
                console.log("should spawn witch");
                const { id, posX, posY, speed, direction } = msg;
                spawnWitch(id, posX, posY, speed, direction);
            });

            clientSocket.on("enemy-pop", (id) => {
                enemyPopWitch(id);
            });

            clientSocket.on("join-response", (result) => {
                if (result) {
                    setGameFlow(true);
                    //console.log("join approved");
                }
            });

            clientSocket.on("update-score", (result) => setScores(result));
        }
        , []
    )

    function enemyPopWitch(id) {
        const result = findWitch(id);
        if (result.witch) {
            pushAll(createParticles(result.witch.position.x, result.witch.position.y), redParticles);
            mobs.splice(result.index, 1);
        }
    }

    function findWitch(id) {
        const witch = mobs.find(e => e.id == id);
        const index = mobs.indexOf(witch);
        return { witch, index };
    }

    /**
     * 
     * @param {number} deltaT 
     */
    function gameLoop(deltaT) {
        update(deltaT);
        draw();
    }

    function update(deltaT) {
        mobs.forEach(w => w.update(deltaT));
        for (let i = 0; i < yellowParticles.length; i++) {
            if (yellowParticles[i] && !yellowParticles[i].update(deltaT)) {
                yellowParticles.splice(i, 1);
            }
        }
        for (let i = 0; i < redParticles.length; i++) {
            if (redParticles[i] && !redParticles[i].update(deltaT)) {
                redParticles.splice(i, 1);
            }
        }
    }

    function draw() {
        canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawBackground(canvasContext);
        for (let i = 0; i < mobs.length; i++) {
            mobs[i].draw(canvasContext);
        }
        drawParticles();
    }

    function drawParticles() {
        //canvasContext.fillStyle = "#3399ff";
        canvasContext.fillStyle = "#ffff44";
        yellowParticles.forEach(p => {
            canvasContext.fillRect(p.x, p.y, p.size, p.size);
        });

        canvasContext.fillStyle = "#f00";
        redParticles.forEach(p => {
            canvasContext.fillRect(p.x, p.y, p.size, p.size);
        });
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    function drawBackground(context) {
        context.drawImage(backgroundImage, 0, 0);
    }

    function testFunction() {
        const { id, posX, posY, speed, direction } = { id: -1, posX: 36, posY: 325, speed: 6, direction: 1.5676518540179596 };
        // spawnWitch(
        //     mobs[0].id,
        //     mobs[0].position.x,
        //     mobs[0].position.y,
        //     mobs[0].speed,
        //     mobs[0].direction
        // );
        spawnWitch({ id, posX, posY, speed, direction });
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    function canvasClickHandler(e) {
        const clickPoint = {
            x: e.offsetX,
            y: e.offsetY
        };
        hitTheWitch(clickPoint);
    }

    function pushAll(elements, array) {
        elements.forEach(e => array.push(e));
    }

    /**
     * 
     * @param {import("../characters/Witch").Point} point 
     */
    function hitTheWitch(point) {
        for (let i = 0; i < mobs.length; i++) {
            const boundingBox = mobs[i].getBoundingBox();
            if (point.x >= boundingBox.left && point.x <= boundingBox.right && point.y >= boundingBox.top && point.y <= boundingBox.bottom) {
                clientSocket.emit("pop-witch", mobs[i].id);
                pushAll(createParticles(point.x, point.y), yellowParticles);
                mobs.splice(i, 1);
                break;
            }
        }
    }

    function renderScores() {
        let i = 0;
        let scoreDoms = scores.map(
            score => <div key={i++} className="score">{score.username} : {score.score}</div>
        );
        return (
            <div className="scores">
                {scoreDoms}
            </div>
        )
    }

    return (
        <>
            <button onClick={testFunction}>test</button>
            <canvas id="game-canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onClick={canvasClickHandler}></canvas>
            {renderScores()}
        </>
    )
}

function spawnWitch(id, posX, posY, speed, direction) {
    mobs.push(new Witch(id, posX, posY, speed, direction));
    console.log("spawned a witch now have " + mobs.length + " witches");
}