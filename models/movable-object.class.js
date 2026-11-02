class MovableObject extends DrawableObject {
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
   
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    
    energy = 100;
    lastHit = 0;

    /** Makes the object drop when it's in the air or flying upward. */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /** Checks if the object is above the ground. */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 80;
    }

    /** Move the object to the right. */
    moveRight() {
        this.x += this.speed;
    }

    /** Move the object to the left. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Show the next picture in a sequence of pictures. */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    /** Makes the object jump. */
    jump() {
        this.speedY = 35;
    }

    /** Checks if this object is touching another one (with offset). */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /** Drains energy and remembers the moment of the hit. */
    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /** Checks if the object was just hit (for half a second). */
    isHurt() {
        let timePassed = (new Date().getTime() - this.lastHit) / 1000;
        return timePassed < 0.5;
    }

    /** Checks if the energy is used up. */
    isDead() {
        return this.energy == 0;
    }
}