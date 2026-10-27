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
    collectedBottles = 0;
    lastThrow = 0;
    wasAboveGround = false;
    gameEnded = false;
    endScreen;
    IMAGE_GAME_OVER = 'img/You won, you lost/Game Over.png';
    IMAGE_YOU_WIN = 'img/You won, you lost/You won A.png';
    statusBarCoin = new StatusBar('coin', 80);
    collectedCoins = 0;
    animationFrame;



    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

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

    checkThrowObjects() {
        let now = new Date().getTime();
        if (this.keyboard.C && !this.character.isDead() && this.collectedBottles > 0 && now - this.lastThrow > 1000) {
            let x = this.character.x + 50;
            if (this.character.otherDirection) {
                x = this.character.x;
            }
            let bottle = new ThrowableObject(x, this.character.y + 150, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            playSound('throwBottle');
            this.collectedBottles--;
            this.statusBarBottle.setPercentage(this.collectedBottles * 10);
            this.lastThrow = now;
        }
    }

    checkCollisionsBottle() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (!bottle.hasSplashed && !enemy.isDead() && bottle.isColliding(enemy)) {
                    bottle.splash();
                    this.hitEnemy(enemy, 1);
                }
            });
        });
    }

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

    removeSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isRemovable);
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead() && this.character.isColliding(enemy)) {
                if (this.isStomp(enemy)) {
                    this.hitEnemy(enemy, enemy.energy);
                } else if (!this.character.isHurt()) {
                    this.hurtCharacter();
                }
            }
        });
        this.wasAboveGround = this.character.isAboveGround();
    }

    isStomp(enemy) {
        let isFalling = (this.character.isAboveGround() || this.wasAboveGround) && this.character.speedY < 0;
        let center = this.character.x + this.character.width / 2;
        let enemyLeft = enemy.x + enemy.offset.left;
        let enemyRight = enemy.x + enemy.width - enemy.offset.right;
        return isFalling && center > enemyLeft && center < enemyRight;
    }

    hurtCharacter() {
        this.character.hit();
        playSound('hitCharacter');
        this.statusBar.setPercentage(this.character.energy);
    }

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

    // checkCollisionsBottle(){
    //      this.level.enemies.forEach((enemy) => {
    //         if(this.bottle.isColliding(enemy)){
    //             this.bottle.splash();
    //         }
    //         });
    //         }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.cloude);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);

        if (this.endScreen) {
            this.ctx.drawImage(this.endScreen, 0, 0, this.canvas.width, this.canvas.height);
        }





        let self = this;
        this.animationFrame = requestAnimationFrame(function () {
            self.draw();
        });
    }

    stop() {
        cancelAnimationFrame(this.animationFrame);
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        mo.drawFrameOffset(this.ctx);


        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

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

    endGame(path, soundName) {
        if (this.gameEnded) {
            return;
        }
        this.gameEnded = true;
        stopSound('music');
        setTimeout(() => {
            this.endScreen = new Image();
            this.endScreen.src = path;
            playSound(soundName);
            showElement('endButtons');
            stopGame();
            stopEndbossSounds();
        }, 1000);
    }

    checkChickensEnterScreen() {
        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Endboss) && !enemy.isDead() && !enemy.hasEnteredScreen && this.isOnScreen(enemy)) {
                enemy.hasEnteredScreen = true;
                playSound('chickenAppear');
            }
        });
    }

    isOnScreen(object) {
        let left = -this.camera_x;
        let right = -this.camera_x + this.canvas.width;
        return object.x < right && object.x + object.width > left;
    }
}