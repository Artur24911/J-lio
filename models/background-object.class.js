class BackgroundObject extends MovableObject {
    width = 721;
    height = 480;

    /** Generates a background section. */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}