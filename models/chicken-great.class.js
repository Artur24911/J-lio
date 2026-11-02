class ChickenGreat extends MovableObject {
    hasEnteredScreen = false;
    height = 90;
    width = 70;
    y = 340;

    offset = {
        top: 10,
        left: 5,
        right: 5,
        bottom: 10
    };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
        'img/grabkreuz_chicken_spiel.png'
    ];

    /** Spawns a big chicken at a random position outside the picture. */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 800 + Math.random() * 1200;
        this.speed = 2.5 + Math.random() * 0.55;
        this.animate();
    }

    /** Starts the loops for movement and animation. */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 30);
        setInterval(() => this.updateImage(), 1000 / 8);
    }

    /** Runs to the left as long as the chicken is alive. */
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