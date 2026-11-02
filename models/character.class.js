/**
 * Der Spielercharakter Pepe.
 */
class Character extends MovableObject {
    height = 350;
    speed = 10;
    cameraOffset = 100;
    jumpSpeed = 35;
    deathStarted = false;
    lastAction = new Date().getTime();
    wasSleeping = false;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
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
        left: 20,
        right: 25,
        bottom: 30
    };


    /**
     * Erzeugt den Charakter, lädt alle Bilder und startet Schwerkraft und Animationen.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLELONG);
        this.applyGravity();
        this.animate();
    }


    /**
     * Startet die drei Schleifen für Bewegung, Animation und Idle.
     */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 50);
        setInterval(() => this.updateIdle(), 200);
    }


    /**
     * Bewegt den Charakter nach den gedrückten Tasten und führt die Kamera nach.
     */
    updateMovement() {
        if (this.isDead()) {
            return;
        }
        this.updateLastAction();
        this.handleWalking();
        this.handleJump();
        this.updateCamera();
    }


    /**
     * Läuft nach links oder rechts, solange die Grenzen des Levels es erlauben.
     */
    handleWalking() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > -500) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }


    /**
     * Springt einmal pro Tastendruck, wenn der Charakter am Boden steht.
     */
    handleJump() {
        if (this.world.keyboard.SPACE && !this.isAboveGround() && this.speedY <= 0) {
            this.jump();
            this.jumpSpeed = this.speedY;
            playSound('jump');
        }
    }


    /**
     * Schiebt die Kamera je nach Blickrichtung weich nach links oder rechts.
     */
    updateCamera() {
        let targetOffset = this.otherDirection ? 520 : 100;
        this.cameraOffset += (targetOffset - this.cameraOffset) * 0.1;
        this.world.camera_x = Math.min(-this.x + this.cameraOffset, 720);
    }


    /**
     * Wählt die passende Animation: Tod, Verletzt, Sprung oder Laufen.
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playDeathAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.showJumpImage();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }


    /**
     * Spielt die Todesanimation einmal ab und bleibt beim letzten Bild.
     */
    playDeathAnimation() {
        if (!this.deathStarted) {
            this.deathStarted = true;
            this.currentImage = 0;
        }
        if (this.currentImage < this.IMAGES_DEAD.length) {
            this.playAnimation(this.IMAGES_DEAD);
        }
    }


    /**
     * Zeigt das Sprungbild passend zum Verlauf des Sprungs.
     */
    showJumpImage() {
        let progress = (this.jumpSpeed - this.speedY) / (2 * this.jumpSpeed + this.acceleration);
        let index = Math.floor(progress * this.IMAGES_JUMPING.length);
        index = Math.max(0, Math.min(index, this.IMAGES_JUMPING.length - 1));
        this.img = this.imageCache[this.IMAGES_JUMPING[index]];
    }


    /**
     * Spielt Idle- oder Schlaf-Animation und die zugehörigen Sounds.
     */
    updateIdle() {
        this.updateSleepSound();
        if (this.isIdle()) {
            this.playAnimation(this.isSleeping() ? this.IMAGES_IDLELONG : this.IMAGES_IDLE);
        }
    }


    /**
     * Spielt beim Einschlafen das Gähnen, danach den Schlaf-Sound in Schleife.
     */
    updateSleepSound() {
        let sleeping = this.isIdle() && this.isSleeping();
        if (sleeping && !this.wasSleeping) {
            playSound('yawn');
        }
        if (sleeping && !isSoundPlaying('yawn')) {
            loopSound('sleep');
        }
        if (!sleeping) {
            this.stopSleepSounds();
        }
        this.wasSleeping = sleeping;
    }


    /**
     * Stoppt Gähnen und Schlaf-Sound.
     */
    stopSleepSounds() {
        stopSound('yawn');
        stopSound('sleep');
    }


    /**
     * Merkt sich den Zeitpunkt der letzten Aktion des Spielers.
     */
    updateLastAction() {
        let keyboard = this.world.keyboard;
        if (keyboard.RIGHT || keyboard.LEFT || keyboard.SPACE || keyboard.C || this.isHurt()) {
            this.lastAction = new Date().getTime();
        }
    }


    /**
     * Prüft, ob der Charakter nichts tut.
     * @returns {boolean} true, wenn er steht
     */
    isIdle() {
        let keyboard = this.world.keyboard;
        return !this.isDead() && !this.isHurt() && !this.isAboveGround() && !keyboard.RIGHT && !keyboard.LEFT;
    }


    /**
     * Prüft, ob der Charakter länger als 10 Sekunden nichts getan hat.
     * @returns {boolean} true, wenn er schläft
     */
    isSleeping() {
        return new Date().getTime() - this.lastAction > 10000;
    }
}
