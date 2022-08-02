export class Particle {
    constructor(x, y, xCenter, yCenter, r) {
        this.x = x;
        this.y = y;
        this.initSize = 0.6;
        this.life = 9;
        this.speed = 1;
        this.xCenter = xCenter;
        this.yCenter = yCenter;
        this.r = r;
        this.rotationStep = 15 * Math.PI / 180;
    }

    update(deltaT) {
        deltaT = deltaT / 80;
        if (this.life > 4) {
            this.y -= this.speed * deltaT;
        } else {
            this.y += this.speed * deltaT;
        }
        const currentAngle = Math.atan2(this.xCenter - this.x, this.yCenter - this.y);
        this.size = Math.max(1, this.initSize * this.life);
        this.x = (this.xCenter + Math.cos(currentAngle + this.rotationStep) * this.r);
        this.y = (this.yCenter - Math.sin(currentAngle + this.rotationStep) * this.r);
        this.r += 4 * deltaT;

        return --this.life;
    }
}

/**
 * @returns {Array<Particle>}
 */
 export function createParticles(xCenter, yCenter) {
    let r = 16;
    let particles = [];
    for (let i = 0; i < Math.PI * 2; i += 25 * Math.PI / 180) {
        particles.push(new Particle(
            xCenter + (r * Math.cos(i)),
            yCenter - (r * Math.sin(i)),
            xCenter, yCenter, r
        ));
    }
    return particles;
}