class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    statusBar = new StatusBar('health', 0);
    statusBarBottle = new StatusBar('bottle', 40);
    collectedBottles = 0;
    lastThrow = 0;



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
    }, 200);

    setInterval(() => {
        this.checkThrowObjects();
        this.checkCollisionsBottle();
        this.checkCollectBottles();
        this.removeSplashedBottles();
    }, 1000 / 30);
    }

    checkThrowObjects() {
       let now = new Date().getTime();
    if (this.keyboard.C && this.collectedBottles > 0 && now - this.lastThrow > 1000) {
        let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 150);
        this.throwableObjects.push(bottle);
        this.collectedBottles--;
        this.statusBarBottle.setPercentage(this.collectedBottles * 10);
        this.lastThrow = now;
    }
    }

    checkCollisionsBottle() {
    this.throwableObjects.forEach((bottle) => {
        this.level.enemies.forEach((enemy) => {
            if (!bottle.hasSplashed && bottle.isColliding(enemy)) {
                bottle.splash();
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
        }
    });
}

removeSplashedBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isRemovable);
}

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
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
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.cloude);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);







        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
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






}