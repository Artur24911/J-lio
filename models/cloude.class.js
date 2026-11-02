class Cloude extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    /** Generates a cloud at a random position. */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }

    /** Causes the cloud to drift permanently to the left. */
    animate() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}