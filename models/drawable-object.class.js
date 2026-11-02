class DrawableObject {
    x = 120;
    y = 80;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /** Loads a single image and registers it with the load counter. */
    loadImage(path) {
        this.img = new Image();
        trackImage(this.img);
        this.img.src = path;
    }

    /** Loads multiple images into the image cache. */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            trackImage(img);
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /** Draws the object, provided the image is fully loaded. */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}