/**
 * Eine geworfene Flasche.
 */
class ThrowableObject extends MovableObject {
    hasSplashed = false;
    isRemovable = false;

    IMAGES_BOTTLEROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLESPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];


    /**
     * Erzeugt eine Flasche und wirft sie sofort.
     * @param {number} x - Startposition
     * @param {number} y - Starthöhe
     * @param {boolean} otherDirection - true, wenn nach links geworfen wird
     */
    constructor(x, y, otherDirection) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_BOTTLEROTATION);
        this.loadImages(this.IMAGES_BOTTLESPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.height = 60;
        this.width = 50;
        this.throw();
        this.animate();
    }


    /**
     * Startet den Flug der Flasche mit Schwerkraft.
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.moveInterval = setInterval(() => this.updateFlight(), 25);
    }


    /**
     * Bewegt die Flasche in Wurfrichtung und lässt sie am Boden platzen.
     */
    updateFlight() {
        this.x += this.otherDirection ? -10 : 10;
        if (this.y >= 370) {
            this.splash();
        }
    }


    /**
     * Dreht die Flasche und spielt dabei die Wurf-Sounds.
     */
    animate() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLEROTATION);
            playSwitchSound();
        }, 1000 / 20);
    }


    /**
     * Lässt die Flasche platzen (einmalig) und startet die Splash-Animation.
     */
    splash() {
        if (this.hasSplashed) {
            return;
        }
        this.hasSplashed = true;
        playSound('splash');
        this.stopFlight();
        this.currentImage = 0;
        this.splashInterval = setInterval(() => this.playSplashFrame(), 1000 / 15);
    }


    /**
     * Beendet Bewegung, Drehung und Schwerkraft der Flasche.
     */
    stopFlight() {
        clearInterval(this.moveInterval);
        clearInterval(this.rotationInterval);
        clearInterval(this.gravityInterval);
    }


    /**
     * Zeigt das nächste Splash-Bild und markiert die Flasche am Ende als entfernbar.
     */
    playSplashFrame() {
        if (this.currentImage >= this.IMAGES_BOTTLESPLASH.length) {
            clearInterval(this.splashInterval);
            this.isRemovable = true;
        } else {
            this.playAnimation(this.IMAGES_BOTTLESPLASH);
        }
    }
}
