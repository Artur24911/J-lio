/**
 * Basisklasse für Objekte, die sich bewegen, springen und Schaden nehmen können.
 */
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


    /**
     * Lässt das Objekt fallen, wenn es in der Luft ist oder nach oben fliegt.
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }


    /**
     * Prüft, ob das Objekt über dem Boden ist.
     * @returns {boolean} true, wenn das Objekt in der Luft ist
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 80;
    }


    /**
     * Bewegt das Objekt nach rechts.
     */
    moveRight() {
        this.x += this.speed;
    }


    /**
     * Bewegt das Objekt nach links.
     */
    moveLeft() {
        this.x -= this.speed;
    }


    /**
     * Zeigt das nächste Bild einer Bilderfolge.
     * @param {string[]} images - Liste der Bildpfade
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }


    /**
     * Lässt das Objekt springen.
     */
    jump() {
        this.speedY = 35;
    }


    /**
     * Prüft, ob dieses Objekt ein anderes berührt (mit Offset).
     * @param {MovableObject|DrawableObject} mo - Das andere Objekt
     * @returns {boolean} true bei Berührung
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }


    /**
     * Zieht Energie ab und merkt sich den Zeitpunkt des Treffers.
     * @param {number} [damage=5] - Höhe des Schadens
     */
    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }


    /**
     * Prüft, ob das Objekt gerade getroffen wurde (halbe Sekunde lang).
     * @returns {boolean} true, wenn das Objekt verletzt ist
     */
    isHurt() {
        let timePassed = (new Date().getTime() - this.lastHit) / 1000;
        return timePassed < 0.5;
    }


    /**
     * Prüft, ob die Energie aufgebraucht ist.
     * @returns {boolean} true, wenn das Objekt tot ist
     */
    isDead() {
        return this.energy == 0;
    }
}
