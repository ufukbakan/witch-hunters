/**
 * @typedef Vector
 * @property {number} x
 * @property {number} y
 */

/**
 * 
 * @param {number} angle 
 * @param {number} length 
 * @returns 
 */
export function angleToVector(angle, length){
    return {
        x: Math.cos(angle)*length,
        y: Math.sin(angle)*length
    }
}

/**
 * 
 * @param {Vector} Vector 
 * @returns 
 */
export function vectorToAngle(vector){
    return Math.atan2(vector.y, vector.x);
}

/**
 * 
 * @param {number} x 
 * @param {number} lower 
 * @param {number} upper 
 */
export function isBetween(x, lower, upper){
    if(x >= lower && x <= upper){
        return true;
    }
    return false;
}