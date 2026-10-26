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

    IMAGES_BOTTLEGROUND = [   //flaschen die im Boden stehen um munition zu sammeln
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];


    constructor(x, y, otherDirection) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png')
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

    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.moveInterval = setInterval(() => {
            if (this.otherDirection) {
                this.x -= 10;
            } else {
                this.x += 10;
            }
            if (this.y >= 370) {
                this.splash();
            }
        }, 25);
    }

    animate() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLEROTATION);
        }, 1000 / 20);



    }

    splash() {
        if (this.hasSplashed) {
            return;
        }
        this.hasSplashed = true;
        clearInterval(this.moveInterval);
        clearInterval(this.rotationInterval);
        clearInterval(this.gravityInterval);
        this.currentImage = 0;
        this.splashInterval = setInterval(() => {
            if (this.currentImage >= this.IMAGES_BOTTLESPLASH.length) {
                clearInterval(this.splashInterval);
                this.isRemovable = true;
            } else {
                this.playAnimation(this.IMAGES_BOTTLESPLASH);
            }
        }, 1000 / 15);
    }

}