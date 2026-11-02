class Level {
    enemies;
    cloude;
    backgroundObjects;
    bottles;
    coins;
    level_end_x = 2200;

    /** Generates a level. */
    constructor(enemies, cloude, backgroundObjects, bottles, coins) {
        this.enemies = enemies;
        this.cloude = cloude;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
    }
}