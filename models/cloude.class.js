/**
 * Eine Wolke, die langsam nach links treibt.
 */
class Cloude extends MovableObject {
    y = 20;
    width = 500;
    height = 250;


    /**
     * Erzeugt eine Wolke an einer zufälligen Position.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }


    /**
     * Lässt die Wolke dauerhaft nach links treiben.
     */
    animate() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}
