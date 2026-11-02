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

    /** Spawns a bottle and throws it immediately. */
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

    /** Start the flight of the bottle with gravity. */
    throw() {
        this.speedY = 25;
        this.applyGravity();
        this.moveInterval = setInterval(() => this.updateFlight(), 25);
    }

    /** Move the bottle in the throwing direction and let it burst on the ground. */
    updateFlight() {
        this.x += this.otherDirection ? -10 : 10;
        if (this.y >= 370) {
            this.splash();
        }
    }

    /** Spin the bottle and play the throwing sounds while doing it. */
    animate() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLEROTATION);
            playSwitchSound();
        }, 1000 / 20);
    }

    /** Makes the bottle burst (once) and starts the splash animation. */
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

    /** Stops the bottle's movement, rotation, and gravity. */
    stopFlight() {
        clearInterval(this.moveInterval);
        clearInterval(this.rotationInterval);
        clearInterval(this.gravityInterval);
    }

    /** Show the next splash image and mark the bottle at the end as removable. */
    playSplashFrame() {
        if (this.currentImage >= this.IMAGES_BOTTLESPLASH.length) {
            clearInterval(this.splashInterval);
            this.isRemovable = true;
        } else {
            this.playAnimation(this.IMAGES_BOTTLESPLASH);
        }
    }
}