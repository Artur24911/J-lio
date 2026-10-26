class Character extends MovableObject {
    height = 350;
    speed = 10;
    cameraOffset = 100;
    jumpSpeed = 35;
    deathStarted = false;

    IMAGES_WALKING = [
        '../img/2_character_pepe/2_walk/W-21.png',
        '../img/2_character_pepe/2_walk/W-22.png',
        '../img/2_character_pepe/2_walk/W-23.png',
        '../img/2_character_pepe/2_walk/W-24.png',
        '../img/2_character_pepe/2_walk/W-25.png',
        '../img/2_character_pepe/2_walk/W-26.png',

    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',

    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_IDLELONG = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    world;

    offset = {
        top: 160,
        left: 30,
        right: 30,
        bottom: 30
    };



    constructor() {
        super().loadImage('../img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                //  this.WALKING_SOUND.play();
            }
            if (this.world.keyboard.LEFT && this.x > -500) {
                this.moveLeft();
                this.otherDirection = true;
                // this.WALKING_SOUND.play();

            }
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.jumpSpeed = this.speedY;
            }

            let targetOffset;
            if (this.otherDirection) {
                targetOffset = 520;
            } else {
                targetOffset = 100;
            }
            this.cameraOffset += (targetOffset - this.cameraOffset) * 0.1;
            this.world.camera_x = -this.x + this.cameraOffset;
            if (this.world.camera_x > 720) {
                this.world.camera_x = 720;
            }
        }, 1000 / 60);

        setInterval(() => {
    if (this.isDead()) {
        if (!this.deathStarted) {
            this.deathStarted = true;
            this.currentImage = 0;
        }
        if (this.currentImage < this.IMAGES_DEAD.length) {
            this.playAnimation(this.IMAGES_DEAD);
        }
    } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
        let progress = (this.jumpSpeed - this.speedY) / (2 * this.jumpSpeed + this.acceleration);
        let index = Math.floor(progress * this.IMAGES_JUMPING.length);
        if (index > this.IMAGES_JUMPING.length - 1) {
            index = this.IMAGES_JUMPING.length - 1;
        }
        if (index < 0) {
            index = 0;
        }
        this.img = this.imageCache[this.IMAGES_JUMPING[index]];
    } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }
}, 50);
    }


}