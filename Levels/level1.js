let level1;


/**
 * Erzeugt Level 1 mit Gegnern, Wolken, Hintergrund, Flaschen und Münzen.
 */
function initLevel() {
    level1 = new Level(
        createEnemies(),
        [new Cloude()],
        createBackgroundObjects(),
        createBottles(),
        createCoins()
    );
}


/**
 * Erzeugt die Gegner des Levels.
 * @returns {MovableObject[]} Liste der Gegner
 */
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


/**
 * Erzeugt den Hintergrund aus fünf Abschnitten (x von -720 bis 2160).
 * @returns {BackgroundObject[]} Liste der Hintergrundbilder
 */
function createBackgroundObjects() {
    let objects = [];
    for (let i = -1; i <= 3; i++) {
        let variant = i % 2 == 0 ? 1 : 2;
        objects.push(...createBackgroundSection(i * 720, variant));
    }
    return objects;
}


/**
 * Erzeugt einen Hintergrundabschnitt aus vier Ebenen.
 * @param {number} x - Startposition des Abschnitts
 * @param {number} variant - 1 oder 2 (welches Bild der Ebene)
 * @returns {BackgroundObject[]} Die vier Ebenen des Abschnitts
 */
function createBackgroundSection(x, variant) {
    let path = 'img/5_background/layers/';
    return [
        new BackgroundObject(path + 'air.png', x),
        new BackgroundObject(path + '3_third_layer/' + variant + '.png', x),
        new BackgroundObject(path + '2_second_layer/' + variant + '.png', x),
        new BackgroundObject(path + '1_first_layer/' + variant + '.png', x)
    ];
}


/**
 * Verteilt zehn Flaschen zufällig auf dem Boden.
 * @returns {Bottle[]} Liste der Flaschen
 */
function createBottles() {
    let bottles = [];
    for (let i = 0; i < 10; i++) {
        bottles.push(new Bottle(300 + Math.random() * 1800));
    }
    return bottles;
}


/**
 * Erzeugt die Münzen an festen Positionen (auf Laufhöhe und in der Luft).
 * @returns {Coin[]} Liste der Münzen
 */
function createCoins() {
    let positions = [
        [450, 320], [500, 320], [900, 160], [960, 110], [1020, 70],
        [1080, 110], [1140, 160], [1600, 320], [1800, 100], [2000, 120]
    ];
    return positions.map((position) => new Coin(position[0], position[1]));
}
