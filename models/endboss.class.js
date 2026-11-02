/**
 * Der Endboss, der den Charakter nach dem ersten Kontakt jagt.
 */
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


    /**
     * Erzeugt den Endboss am Ende des Levels und lädt seine Bilder.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2550;
        this.animate();
    }


    /**
     * Startet die Schleifen für Zustand und Verfolgung.
     */
    animate() {
        setInterval(() => this.updateState(), 200);
        setInterval(() => this.updateChase(), 1000 / 60);
    }


    /**
     * Aktualisiert Animation, Kontakt, Verfolgung und Sound des Bosses.
     */
    updateState() {
        this.updateAnimation();
        this.stateTick++;
        this.checkFirstContact();
        this.isChasing = this.hadFirstContact && this.stateTick >= 10 && !this.isHurt() && !this.isDead();
        this.updateSound();
    }


    /**
     * Wählt die Animation: Tod, Verletzt, Alert (Wut) oder Laufen.
     */
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
     * Startet beim ersten Kontakt mit dem Charakter die Alert-Animation.
     */
    checkFirstContact() {
        if (world && !this.hadFirstContact && this.x - world.character.x < 500) {
            this.stateTick = 0;
            this.hadFirstContact = true;
        }
    }


    /**
     * Läuft auf den Charakter zu, solange der Boss ihn jagt.
     */
    updateChase() {
        if (this.isChasing) {
            this.chaseCharacter();
        }
    }


    /**
     * Läuft in Richtung des Charakters und dreht sich dabei um.
     */
    chaseCharacter() {
        if (world.character.x < this.x) {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
    }


    /**
     * Spielt die Boss-Sounds und beschleunigt die Musik, solange der Boss kämpft.
     */
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
