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
    statusBarEndboss = new StatusBar('endboss', 0, 450);
    collectedBottles = 0;
    collectedCoins = 0;
    lastThrow = 0;
    wasAboveGround = false;
    gameEnded = false;
    endScreen;
    animationFrame;
    IMAGE_GAME_OVER = 'img/You won, you lost/Game Over.png';
    IMAGE_YOU_WIN = 'img/You won, you lost/You won A.png';

    /** Generates the world, starts the drawing, and the game rules. */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    /** Gives the character a reference to the world. */
    setWorld() {
        this.character.world = this;
    }

    /** Checks all the game rules 30 times per second. */
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

    /** Throws a bottle when C is pressed and the throw cooldown is over. */
    checkThrowObjects() {
        let now = new Date().getTime();
        if (this.canThrow(now)) {
            this.throwBottle();
            this.lastThrow = now;
        }
    }

    /** Checks if a bottle can be thrown right now. */
    canThrow(now) {
        return this.keyboard.C && !this.character.isDead() && this.collectedBottles > 0 && now - this.lastThrow > 1000;
    }

    /** Spawns a thrown bottle in the character's line of sight.*/
    throwBottle() {
        let x = this.character.otherDirection ? this.character.x : this.character.x + 50;
        let bottle = new ThrowableObject(x, this.character.y + 150, this.character.otherDirection);
        this.throwableObjects.push(bottle);
        playSound('throwBottle');
        this.collectedBottles--;
        this.statusBarBottle.setPercentage(this.collectedBottles * 10);
    }

    /** Checks if a thrown bottle hits an opponent. */
    checkCollisionsBottle() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => this.checkBottleHit(bottle, enemy));
        });
    }

    /** Makes a bottle break when it hits a living opponent. */
    checkBottleHit(bottle, enemy) {
        if (!bottle.hasSplashed && !enemy.isDead() && bottle.isColliding(enemy)) {
            bottle.splash();
            this.hitEnemy(enemy, 1);
        }
    }

    /** Pick up bottles from the ground (at most 10). */
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

    /** Removes bottles whose splash animation is finished. */
    removeSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isRemovable);
    }

    /** Checks for touches between the character and enemies. */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => this.handleEnemyCollision(enemy));
        this.wasAboveGround = this.character.isAboveGround();
    }

    /** Defeat the enemy with a jump from above, otherwise he will hurt the character. */
    handleEnemyCollision(enemy) {
        if (enemy.isDead() || !this.character.isColliding(enemy)) {
            return;
        }
        if (this.isStomp(enemy)) {
            this.hitEnemy(enemy, this.getStompDamage(enemy));
        } else if (!this.character.isHurt()) {
            this.hurtCharacter();
        }
    }

    /** Damage from a jump from above: chickens die, the boss loses a hit. */
    getStompDamage(enemy) {
        return enemy instanceof Endboss ? 1 : enemy.energy;
    }

    /** Checks if the character falls onto the enemy from above. */
    isStomp(enemy) {
        let isFalling = (this.character.isAboveGround() || this.wasAboveGround) && this.character.speedY < 0;
        let center = this.character.x + this.character.width / 2;
        let enemyLeft = enemy.x + enemy.offset.left;
        let enemyRight = enemy.x + enemy.width - enemy.offset.right;
        return isFalling && center > enemyLeft && center < enemyRight;
    }

    /** Drains life from the character and updates the display. */
    hurtCharacter() {
        this.character.hit();
        playSound('hitCharacter');
        this.statusBar.setPercentage(this.character.energy);
    }

    /** Collect coins and update the coin display. */
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

    /** Draws a complete picture and plans the next one. */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawStatusBars();
        this.drawGameObjects();
        this.drawEndScreen();
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    /** Draws the background with camera movement. */
    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    /** Draws the background with camera movement. */
    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        if (this.getEndboss().hasStartedChase()) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    /** Draw characters, clouds, bottles, coins, enemies, and throwing bottles. */
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

    /** Draws the final image (Game Over or You Win), if present. */
    drawEndScreen() {
        if (this.endScreen) {
            this.ctx.drawImage(this.endScreen, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /** Stop drawing the world.en der Welt. */
    stop() {
        cancelAnimationFrame(this.animationFrame);
    }

    /** Draws all objects in a list that are within the visible area. */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            if (this.isOnScreen(o)) {
                this.addToMap(o);
            }
        });
    }

    /** Draws an object and flips it if it's looking to the left. */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /** Mirrors the artboard for an object. */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /** Undo the mirroring. */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /** Deals damage to an opponent and plays the matching sound.*/
    hitEnemy(enemy, damage) {
        if (enemy instanceof Endboss && enemy.isHurt()) {
            return;
        }
        enemy.hit(damage);
        if (enemy instanceof Endboss) {
            this.onEndbossHit(enemy);
        } else if (enemy.isDead()) {
            playSound('chickenDead');
        }
    }

    /** Updates the boss display and plays the sounds when he dies. */
    onEndbossHit(endboss) {
        this.statusBarEndboss.setPercentage(endboss.energy * 100 / endboss.maxEnergy);
        if (endboss.isDead()) {
            playSound('endbossDead');
            stopEndbossSounds();
            setMusicSpeed(1);
        }
    }

    /** Checks if the game is lost or won. */
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

    /** Ends the game once and shows the final screen after one second. */
    endGame(path, soundName) {
        if (this.gameEnded) {
            return;
        }
        this.gameEnded = true;
        stopSound('music');
        setTimeout(() => this.showEndScreen(path, soundName), 1000);
    }

    /** Shows the final image and final sound, hides the controls, and stops the game. */
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

    /** Plays a sound when a chicken appears on screen for the first time. */
    checkChickensEnterScreen() {
        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Endboss) && !enemy.isDead() && !enemy.hasEnteredScreen && this.isOnScreen(enemy)) {
                enemy.hasEnteredScreen = true;
                playSoundIfFree('chickenAppear');
            }
        });
    }

    /** Checks if an object is within the camera's visible area. */
    isOnScreen(object) {
        let left = -this.camera_x;
        let right = -this.camera_x + this.canvas.width;
        return object.x < right && object.x + object.width > left;
    }

    /** Look for the final boss in the enemy list. */
    getEndboss() {
        return this.level.enemies.find((enemy) => enemy instanceof Endboss);
    }
}