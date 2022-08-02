import PreloadAssets from "./PreloadAssets";

/**
 * @readonly
 * @enum {string}
 */
export const Direction = {
    horizontal: "horizontal",
    vertical: "vertical"
}

await PreloadAssets();

/**
 *   @property {string} path
 *   @property {number} frames
 *   @property {number} currentFrame
 *   @property {number} direction
 *   @property {Image} img
 *   @property {number} width
 *   @property {number} height
 *   @property {boolean} loop
 */
export class SpriteLoader {

    /**
     * @typedef SpriteConfig
     * @property {string} path
     * @property {number} frames
     * @property {Direction} direction
     * @property {boolean} loop
     */

    /**
     * 
     * @param {SpriteConfig} config 
     */
    constructor(config) {
        this.path = config.path;
        this.frames = config.frames;
        this.currentFrame = 0;
        this.direction = config.direction;
        this.img = new Image();
        this.img.src = config.path;
        this.width = this.img.width;
        this.height = this.img.height;
        switch (this.direction) {
            case (Direction.horizontal):
                this.width /= this.frames;
                break;
            case (Direction.vertical):
                this.height /= this.frames;
                break;
        }
        this.loop = config.loop ?? true;
    }

    /**
     * @typedef FrameInfo
     * @property {number} width
     * @property {number} height
     * @property {number} sourceX
     * @property {number} sourceY
     */

    /**
     * 
     * @returns {FrameInfo}
     */
    getNextFrameInfo() {
        let frameWidth = this.width;
        let frameHeight = this.height;

        let sourceX = 0;
        let sourceY = 0;

        switch (this.direction) {
            case (Direction.horizontal):
                sourceX = frameWidth * this.currentFrame;
                break;
            case (Direction.vertical):
                sourceY = frameHeight * this.currentFrame;
                break;
        }

        let frameInfo = {
            width: frameWidth,
            height: frameHeight,
            sourceX, sourceY
        }

        if (this.loop) {
            this.currentFrame = (this.currentFrame + 1) % this.frames;
        }
        else if (this.currentFrame < this.frames - 1) {
            this.currentFrame += 1;
        }

        return frameInfo;
    }
}

export class FreezySpriteLoader extends SpriteLoader{

    /**
     * 
     * @param {SpriteConfig} config 
     * @param {number} freezeForFrames 
     */
    constructor(config, freezeForFrames){
        super(config);
        this.counter = 1;
        this.freezeForFrames = freezeForFrames;
    }

    getNextFrameInfo(){
        let frameInfo = super.getNextFrameInfo();
        this.currentFrame -= 1;
        this.counter = (this.counter + 1) % this.freezeForFrames;
        if(this.counter == 0){
            this.currentFrame += 1;
        }
        return frameInfo;
    }
}