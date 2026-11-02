class Chicken extends MovableObject {
    hasEnteredScreen = false;
    energy = 1;
    height = 60;
    width = 40;
    y = 360;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
        'img/grabkreuz_chicken_spiel.png'
    ];

    offset = {
        top: 10,
        left: 5,
        right: 5,
        bottom: 10
    };

    /** Spawns a chick at a random position outside the image. */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 800 + Math.random() * 1200;
        this.speed = 0.15 + Math.random() * 0.55;
        this.animate();
    }

    /** Starts the loops for movement and animation. */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateImage(), 1000 / 8);
    }

    /** Runs to the left as long as the chick is alive. */
    updateMovement() {
        if (!this.isDead()) {
            this.moveLeft();
        }
    }

    /** Shows running image or, if dead, the dead image. */
    updateImage() {
        if (this.isDead()) {
            this.showDeadImage();
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /** Briefly shows the death image and then permanently the cross. */
    showDeadImage() {
        let index = this.isHurt() ? 0 : 1;
        this.img = this.imageCache[this.IMAGES_DEAD[index]];
    }
}