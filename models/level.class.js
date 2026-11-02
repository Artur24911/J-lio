/**
 * Ein Level mit allen Objekten.
 */
class Level {
    enemies;
    cloude;
    backgroundObjects;
    bottles;
    coins;
    level_end_x = 2200;


    /**
     * Erzeugt ein Level.
     * @param {MovableObject[]} enemies - Gegner
     * @param {Cloude[]} cloude - Wolken
     * @param {BackgroundObject[]} backgroundObjects - Hintergrundbilder
     * @param {Bottle[]} bottles - Flaschen am Boden
     * @param {Coin[]} coins - Münzen
     */
    constructor(enemies, cloude, backgroundObjects, bottles, coins) {
        this.enemies = enemies;
        this.cloude = cloude;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
    }
}
