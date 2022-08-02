/**
 * @param {CanvasRenderingContext2D} context
 * @param {SpriteLoader} sprite 
 * @param {number} x 
 * @param {number} y 
 */
export function drawSprite(context, sprite, x, y) {
    const frame = sprite.getNextFrameInfo();
    context.drawImage(sprite.img, frame.sourceX, frame.sourceY, frame.width, frame.height, x - frame.width / 2, y - frame.height / 2, frame.width, frame.height);
}