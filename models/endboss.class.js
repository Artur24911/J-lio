class Endboss extends MovableObject {
    energy = 3;
    height = 400;
    width = 230;
    y = 45;
    speed = 4;
    isChasing = false;
    deathStarted = false;
    hadFirstContact = false;
    stateTick = 0;

    offset = {
        top: 100,
        left: 40,
        right: 30,
        bottom: 40,
    };

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTAK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /** Spawns the final boss at the end of the level and loads its images. */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2550;
        this.animate();
    }

    /** Starts the loops for state and tracking. */
    animate() {
        setInterval(() => this.updateState(), 200);
        setInterval(() => this.updateChase(), 1000 / 60);
    }

    /** Updated the boss's animation, hit detection, tracking, and sound. */
    updateState() {
        this.updateAnimation();
        this.stateTick++;
        this.checkFirstContact();
        this.isChasing = this.hadFirstContact && this.stateTick >= 10 && !this.isHurt() && !this.isDead();
        this.updateSound();
    }

    /** Choose the animation: Dead, Injured, Alert (Angry), or Running. */
    updateAnimation() {
        if (this.isDead()) {
            this.playDeathAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.stateTick < 10) {
            this.playAnimation(this.IMAGES_ALERT);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /** Play the death animation once and stay on the last frame */
    playDeathAnimation() {
        if (!this.deathStarted) {
            this.deathStarted = true;
            this.currentImage = 0;
        }
        if (this.currentImage < this.IMAGES_DEAD.length) {
            this.playAnimation(this.IMAGES_DEAD);
        }
    }

    /** Start the alert animation when you first contact the character. */
    checkFirstContact() {
        if (world && !this.hadFirstContact && this.x - world.character.x < 500) {
            this.stateTick = 0;
            this.hadFirstContact = true;
        }
    }

    /** Runs towards the character as long as the boss is chasing him. */
    updateChase() {
        if (this.isChasing) {
            this.chaseCharacter();
        }
    }

    /** Runs towards the character and turns around while doing so. */
    chaseCharacter() {
        if (world.character.x < this.x) {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    /** Plays the boss sounds and speeds up the music as long as the boss is fighting. */
    updateSound() {
        if (this.hadFirstContact && !this.isDead()) {
            loopEndbossSounds();
            setMusicSpeed(1.3);
        } else {
            stopEndbossSounds();
            setMusicSpeed(1);
        }
    }
}