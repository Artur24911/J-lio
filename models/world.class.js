/**
 * Die Spielwelt: verbindet Charakter, Level, Anzeigen und die Spielregeln.
 */
class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    statusBar = new StatusBar('health', 0);
    statusBarBottle = new StatusBar('bottle', 40);
    statusBarCoin = new StatusBar('coin', 80);
    collectedBottles = 0;
    collectedCoins = 0;
    lastThrow = 0;
    wasAboveGround = false;
    gameEnded = false;
    endScreen;
    animationFrame;
    IMAGE_GAME_OVER = 'img/You won, you lost/Game Over.png';
    IMAGE_YOU_WIN = 'img/You won, you lost/You won A.png';


    /**
     * Erzeugt die Welt, startet das Zeichnen und die Spielregeln.
     * @param {HTMLCanvasElement} canvas - Die Zeichenfläche
     * @param {Keyboard} keyboard - Die Tastenzustände
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }


    /**
     * Gibt dem Charakter einen Verweis auf die Welt.
     */
    setWorld() {
        this.character.world = this;
    }


    /**
     * Prüft 30-mal pro Sekunde alle Spielregeln.
     */
    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkCollisionsBottle();
            this.checkCollectBottles();
            this.removeSplashedBottles();
            this.checkGameEnd();
            this.checkCollectCoins();
            this.checkChickensEnterScreen();
        }, 1000 / 30);
    }


    /**
     * Wirft eine Flasche, wenn C gedrückt ist und die Wurfpause vorbei ist.
     */
    checkThrowObjects() {
        let now = new Date().getTime();
        if (this.canThrow(now)) {
            this.throwBottle();
            this.lastThrow = now;
        }
    }


    /**
     * Prüft, ob gerade eine Flasche geworfen werden darf.
     * @param {number} now - Aktuelle Zeit in Millisekunden
     * @returns {boolean} true, wenn der Wurf erlaubt ist
     */
    canThrow(now) {
        return this.keyboard.C && !this.character.isDead() && this.collectedBottles > 0 && now - this.lastThrow > 1000;
    }


    /**
     * Erzeugt eine geworfene Flasche in Blickrichtung des Charakters.
     */
    throwBottle() {
        let x = this.character.otherDirection ? this.character.x : this.character.x + 50;
        let bottle = new ThrowableObject(x, this.character.y + 150, this.character.otherDirection);
        this.throwableObjects.push(bottle);
        playSound('throwBottle');
        this.collectedBottles--;
        this.statusBarBottle.setPercentage(this.collectedBottles * 10);
    }


    /**
     * Prüft, ob eine geworfene Flasche einen Gegner trifft.
     */
    checkCollisionsBottle() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => this.checkBottleHit(bottle, enemy));
        });
    }


    /**
     * Lässt eine Flasche platzen, wenn sie einen lebenden Gegner trifft.
     * @param {ThrowableObject} bottle - Die geworfene Flasche
     * @param {MovableObject} enemy - Der Gegner
     */
    checkBottleHit(bottle, enemy) {
        if (!bottle.hasSplashed && !enemy.isDead() && bottle.isColliding(enemy)) {
            bottle.splash();
            this.hitEnemy(enemy, 1);
        }
    }


    /**
     * Sammelt Flaschen vom Boden ein (höchstens 10).
     */
    checkCollectBottles() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.collectedBottles < 10 && this.character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1);
                this.collectedBottles++;
                this.statusBarBottle.setPercentage(this.collectedBottles * 10);
                playSound('pickupBottle');
            }
        });
    }


    /**
     * Entfernt Flaschen, deren Splash-Animation vorbei ist.
     */
    removeSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isRemovable);
    }


    /**
     * Prüft Berührungen zwischen Charakter und Gegnern.
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => this.handleEnemyCollision(enemy));
        this.wasAboveGround = this.character.isAboveGround();
    }


    /**
     * Besiegt den Gegner bei einem Sprung von oben, sonst verletzt er den Charakter.
     * @param {MovableObject} enemy - Der Gegner
     */
    handleEnemyCollision(enemy) {
        if (enemy.isDead() || !this.character.isColliding(enemy)) {
            return;
        }
        if (this.isStomp(enemy)) {
            this.hitEnemy(enemy, enemy.energy);
        } else if (!this.character.isHurt()) {
            this.hurtCharacter();
        }
    }


    /**
     * Prüft, ob der Charakter von oben auf den Gegner fällt.
     * @param {MovableObject} enemy - Der Gegner
     * @returns {boolean} true bei einem Sprung von oben
     */
    isStomp(enemy) {
        let isFalling = (this.character.isAboveGround() || this.wasAboveGround) && this.character.speedY < 0;
        let center = this.character.x + this.character.width / 2;
        let enemyLeft = enemy.x + enemy.offset.left;
        let enemyRight = enemy.x + enemy.width - enemy.offset.right;
        return isFalling && center > enemyLeft && center < enemyRight;
    }


    /**
     * Zieht dem Charakter Leben ab und aktualisiert die Anzeige.
     */
    hurtCharacter() {
        this.character.hit();
        playSound('hitCharacter');
        this.statusBar.setPercentage(this.character.energy);
    }


    /**
     * Sammelt Münzen ein und aktualisiert die Münz-Anzeige.
     */
    checkCollectCoins() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.collectedCoins++;
                this.statusBarCoin.setPercentage(this.collectedCoins * 10);
                playSound('coin');
            }
        });
    }


    /**
     * Zeichnet ein komplettes Bild und plant das nächste.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawStatusBars();
        this.drawGameObjects();
        this.drawEndScreen();
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }


    /**
     * Zeichnet den Hintergrund mit Kamerabewegung.
     */
    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
    }


    /**
     * Zeichnet die drei Anzeigen fest am Bildrand.
     */
    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
    }


    /**
     * Zeichnet Charakter, Wolken, Flaschen, Münzen, Gegner und Wurf-Flaschen.
     */
    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.cloude);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }


    /**
     * Zeichnet das Endbild (Game Over oder You Win), falls vorhanden.
     */
    drawEndScreen() {
        if (this.endScreen) {
            this.ctx.drawImage(this.endScreen, 0, 0, this.canvas.width, this.canvas.height);
        }
    }


    /**
     * Stoppt das Zeichnen der Welt.
     */
    stop() {
        cancelAnimationFrame(this.animationFrame);
    }


    /**
     * Zeichnet alle Objekte einer Liste, die im sichtbaren Bereich sind.
     * @param {DrawableObject[]} objects - Liste der Objekte
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            if (this.isOnScreen(o)) {
                this.addToMap(o);
            }
        });
    }


    /**
     * Zeichnet ein Objekt und spiegelt es, wenn es nach links schaut.
     * @param {DrawableObject} mo - Das Objekt
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }


    /**
     * Spiegelt die Zeichenfläche für ein Objekt.
     * @param {DrawableObject} mo - Das Objekt
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }


    /**
     * Macht die Spiegelung wieder rückgängig.
     * @param {DrawableObject} mo - Das Objekt
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }


    /**
     * Fügt einem Gegner Schaden zu und spielt den passenden Sound.
     * @param {MovableObject} enemy - Der Gegner
     * @param {number} damage - Höhe des Schadens
     */
    hitEnemy(enemy, damage) {
        enemy.hit(damage);
        if (enemy.isDead() && enemy instanceof Endboss) {
            playSound('endbossDead');
            stopEndbossSounds();
            setMusicSpeed(1);
        } else if (enemy.isDead()) {
            playSound('chickenDead');
        }
    }


    /**
     * Prüft, ob das Spiel verloren oder gewonnen ist.
     */
    checkGameEnd() {
        if (this.character.isDead()) {
            this.endGame(this.IMAGE_GAME_OVER, 'gameOver');
        }
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss && enemy.isDead()) {
                this.endGame(this.IMAGE_YOU_WIN, 'won');
            }
        });
    }


    /**
     * Beendet das Spiel einmalig und zeigt nach einer Sekunde das Endbild.
     * @param {string} path - Pfad zum Endbild
     * @param {string} soundName - Name des Endsounds
     */
    endGame(path, soundName) {
        if (this.gameEnded) {
            return;
        }
        this.gameEnded = true;
        stopSound('music');
        setTimeout(() => this.showEndScreen(path, soundName), 1000);
    }


    /**
     * Zeigt Endbild und Endsound, blendet die Bedienung aus und stoppt das Spiel.
     * @param {string} path - Pfad zum Endbild
     * @param {string} soundName - Name des Endsounds
     */
    showEndScreen(path, soundName) {
        this.endScreen = new Image();
        this.endScreen.src = path;
        playSound(soundName);
        showElement('endButtons');
        hideElement('touchControls');
        hideElement('settingsButton');
        stopGame();
        stopEndbossSounds();
    }


    /**
     * Spielt einen Sound, wenn ein Huhn zum ersten Mal ins Bild kommt.
     */
    checkChickensEnterScreen() {
        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Endboss) && !enemy.isDead() && !enemy.hasEnteredScreen && this.isOnScreen(enemy)) {
                enemy.hasEnteredScreen = true;
                playSoundIfFree('chickenAppear');
            }
        });
    }


    /**
     * Prüft, ob ein Objekt im sichtbaren Bereich der Kamera liegt.
     * @param {DrawableObject} object - Das Objekt
     * @returns {boolean} true, wenn es sichtbar ist
     */
    isOnScreen(object) {
        let left = -this.camera_x;
        let right = -this.camera_x + this.canvas.width;
        return object.x < right && object.x + object.width > left;
    }
}
