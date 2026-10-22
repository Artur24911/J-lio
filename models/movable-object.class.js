class MovableObject {
    x = 120;
    y = 80;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    energy = 100;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 80;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    }
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    drawFrameOffset(ctx){
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x - this.offset.bottom, this.y - this.offset.top, this.width - this.offset.right, this.height - this.offset.left);
            ctx.stroke();
        }
    }

    moveRight() {
        this.x += this.speed;


    }


    moveLeft() {

        this.x -= this.speed;



    }

    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


    jump() {
        this.speedY = 30;
    }


    isColliding(mo) {
        return this.x + this.width  > mo.x  &&
            this.y + this.height  > mo.y  &&
            this.x  < mo.x + mo.width  &&
            this.y < mo.y + mo.height ;
    }
    
    hit(){
        this.energy -=5;
        if(this.energy < 0){
            this.energy = 0;
        }
    }
    
    isDead(){
        return this.energy == 0;
    }
}