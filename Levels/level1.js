let level1;

/** Generates Level 1 with enemies, clouds, background, bottles, and coins. */
function initLevel() {
    level1 = new Level(
        createEnemies(),
        [new Cloude()],
        createBackgroundObjects(),
        createBottles(),
        createCoins()
    );
}

/** Generates the enemies of the level. */
function createEnemies() {
    return [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss(),
        new ChickenGreat(),
        new ChickenGreat(),
        new ChickenGreat()
    ];
}

/** Generates the background from five sections (x from -720 to 2160). */
function createBackgroundObjects() {
    let objects = [];
    for (let i = -1; i <= 3; i++) {
        let variant = i % 2 == 0 ? 1 : 2;
        objects.push(...createBackgroundSection(i * 720, variant));
    }
    return objects;
}

/** Creates a background section from four layers. */
function createBackgroundSection(x, variant) {
    let path = 'img/5_background/layers/';
    return [
        new BackgroundObject(path + 'air.png', x),
        new BackgroundObject(path + '3_third_layer/' + variant + '.png', x),
        new BackgroundObject(path + '2_second_layer/' + variant + '.png', x),
        new BackgroundObject(path + '1_first_layer/' + variant + '.png', x)
    ];
}

/** Scatter ten bottles randomly on the floor. */
function createBottles() {
    let bottles = [];
    for (let i = 0; i < 10; i++) {
        bottles.push(new Bottle(300 + Math.random() * 1800));
    }
    return bottles;
}

/** Generates the coins at fixed positions (at running height and in the air). */
function createCoins() {
    let positions = [
        [450, 320], [500, 320], [900, 160], [960, 110], [1020, 70],
        [1080, 110], [1140, 160], [1600, 320], [1800, 100], [2000, 120]
    ];
    return positions.map((position) => new Coin(position[0], position[1]));
}