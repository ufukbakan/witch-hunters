/**
 * @typedef Point
 * @property {number} x
 * @property {number} y
 */

// /**
//  * @enum {string}
//  * @readonly
//  */
// export const WitchStates = {
//     "idle": "idle",
//     "run": "run",
//     "charge": "charge",
//     "attack": "attack",
//     "takeDamage": "takeDamage",
//     "death": "death"
// }

/**
 * @enum {string}
 * @readonly
 */
export const WitchStates = {
    "fly": "fly",
    "dead": "dead"
}

/**
 * @enum
 * @readonly
 */
const Facing = {
    RIGHT: 0,
    LEFT: 1
}

import { drawSprite } from "../utilities/SpriteDrawer";
import { Direction, FreezySpriteLoader } from "../utilities/SpriteLoader";
// import idleSprite from "/src/assets/blue-witch/B_witch_idle.png";
// import runSprite from "/src/assets/blue-witch/B_witch_run.png";
// import chargeSprite from "/src/assets/blue-witch/B_witch_charge.png";
// import attackSprite from "/src/assets/blue-witch/B_witch_attack.png";
// import takeDmgSprite from "/src/assets/blue-witch/B_witch_take_damage.png";
// import deathSprite from "/src/assets/blue-witch/B_witch_death.png";
import redWitch from "../assets/red_witch.png";
import redWitchLeft from "../assets/red_witch_left.png";
import { angleToVector, isBetween, makeNegative, makePositive, vectorToAngle } from "../utilities/TransformHelper";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../components/Game";
import { assets } from "../utilities/PreloadAssets";

/**
 * @property {number} id
 * @property {SpriteLoader} sprite
 * @property {Point} position
 * @property {number} speed
 * @property {number} hp
 * @property {Facing} facing
 * @property {number} direction
 */
export default class Witch {

    constructor(id, initialX = 200, initialY = 200, speed = 5, initialDirection = 0) {
        this.id = id;
        this.sprites = {
            // idle: new SpriteLoader({ path: idleSprite, direction: Direction.vertical, frames: 6 }),
            // run: new SpriteLoader({ path: runSprite, frames: 8, direction: Direction.vertical }),
            // charge: new SpriteLoader({ path: chargeSprite, frames: 5, direction: Direction.vertical }),
            // attack: new SpriteLoader({ path: attackSprite, frames: 9, direction: Direction.vertical }),
            // takeDamage: new SpriteLoader({ path: takeDmgSprite, frames: 3, direction: Direction.vertical }),
            // death: new SpriteLoader({ path: deathSprite, frames: 12, direction: Direction.vertical, loop: false }),
            // fly: new FreezySpriteLoader({ path: "http://localhost/src/assets/red_witch.png", frames: 32, direction: Direction.horizontal}, 10),
            // flyLeft: new FreezySpriteLoader({ path: "http://localhost/src/assets/red_witch_left.png", frames: 32, direction: Direction.horizontal}, 10),
            fly: new FreezySpriteLoader({ path: redWitch, frames: 32, direction: Direction.horizontal }, 10),
            flyLeft: new FreezySpriteLoader({ path: redWitchLeft, frames: 32, direction: Direction.horizontal }, 10),
        };
        this.state = WitchStates.fly;
        this.sprite = this.sprites[this.state];
        this.hp = 100;
        this.position = {
            x: initialX,
            y: initialY
        }
        this.speed = speed;
        this.facing = Facing.RIGHT;
        this.direction = initialDirection;
        this.velocity = angleToVector(this.direction, speed);
    }

    update(deltaT) {
        deltaT = deltaT / 80;
        this.velocity = angleToVector(this.direction, this.speed);
        this.position.x += this.velocity.x;
        this.position.y -= this.velocity.y;
        if (this.position.x < 0) {
            this.velocity.x = makePositive(this.velocity.x);
            this.direction = vectorToAngle(this.velocity);
        }
        else if (this.position.x > CANVAS_WIDTH - 16) {
            this.velocity.x = makeNegative(this.velocity.x);
            this.direction = vectorToAngle(this.velocity);
        }
        if (this.position.y < 0) {
            this.velocity.y = makeNegative(this.velocity.y);
            this.direction = vectorToAngle(this.velocity);
        }
        else if (this.position.y > CANVAS_HEIGHT) {
            this.velocity.y = makePositive(this.velocity.y);
            this.direction = vectorToAngle(this.velocity);
        }
        if (this.direction < 0) {
            this.direction += 2 * Math.PI;
        } else if (this.direction > Math.PI * 2) {
            this.direction = (this.direction) % (Math.PI * 2);
        }
        if (this.facing == Facing.LEFT && !isBetween(this.direction, Math.PI / 2, 3 * Math.PI / 2)) {
            this.facing = Facing.RIGHT;
            this.sprite = this.sprites.fly;
        }
        else if (this.facing == Facing.RIGHT && isBetween(this.direction, Math.PI / 2, 3 * Math.PI / 2)) {
            this.facing = Facing.LEFT;
            this.sprite = this.sprites.flyLeft;
        }
    }

    setState(newState) {
        if (this.state != newState) {
            this.state = newState;
            // this.sprite = this.sprites[this.state];
            // this.sprite.currentFrame = 0;
        }
    }

    getBoundingBox() {
        return {
            left: this.position.x - this.sprite.width / 2,
            right: this.position.x + this.sprite.width / 2,
            top: this.position.y - this.sprite.height / 2,
            bottom: this.position.y + this.sprite.height / 2,
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        // context.drawImage(this.sprite, this.position.x, this.position.y);
        drawSprite(context, this.sprite, this.position.x, this.position.y);
    }
}